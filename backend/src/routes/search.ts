import type { FastifyInstance } from "fastify";
import rateLimit from "@fastify/rate-limit";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { ok, fail } from "../lib/apiResponse";
import { ErrorLogger } from "../lib/errors";
import { rateLimitConfig } from "../lib/auth";

const searchQuerySchema = z.object({
  q: z.string().min(2, "Search query must be at least 2 characters").max(100, "Search query is too long"),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  fuzzy: z.coerce.boolean().optional().default(true),
  highlight: z.coerce.boolean().optional().default(true),
  type: z.string().optional(),
  category: z.string().optional(),
  location: z.string().optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
});

const suggestionsQuerySchema = z.object({
  q: z.string().min(1, "Query is required").max(100, "Query is too long"),
  limit: z.coerce.number().int().min(1).max(20).default(10),
});

type SearchType = "fighter" | "event" | "news" | "club";

interface SearchResult {
  id: string;
  type: SearchType;
  title: string;
  subtitle?: string;
  description?: string;
  image?: string | null;
  url: string;
  score: number;
  highlights: string[];
}

const DEFAULT_TYPE_ORDER: SearchType[] = ["fighter", "event", "news", "club"];

const escapeRegExp = (input: string) => input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function computeScore(fields: Array<string | null | undefined>, query: string): number {
  const normalizedQuery = query.toLowerCase();
  let bestScore = 0;

  fields.forEach(field => {
    if (!field) return;
    const normalizedField = field.toLowerCase();

    if (normalizedField === normalizedQuery) {
      bestScore = Math.max(bestScore, 1);
      return;
    }

    if (normalizedField.includes(normalizedQuery)) {
      const score = normalizedQuery.length / normalizedField.length;
      bestScore = Math.max(bestScore, Math.min(0.9, score + 0.2));
      return;
    }

    const queryTokens = normalizedQuery.split(/\s+/).filter(Boolean);
    const matches = queryTokens.filter(token => normalizedField.includes(token));
    if (matches.length) {
      bestScore = Math.max(bestScore, Math.min(0.7, matches.length / queryTokens.length));
    }
  });

  return Number(bestScore.toFixed(3));
}

function collectHighlights(fields: Array<string | null | undefined>, query: string, enabled: boolean): string[] {
  if (!enabled) return [];
  const regex = new RegExp(`(.{0,25})(${escapeRegExp(query)})(.{0,25})`, "gi");
  const highlights: string[] = [];

  fields.forEach(field => {
    if (!field) return;
    const matches = field.match(regex);
    if (matches) {
      highlights.push(...matches.map(match => match.trim()));
    }
  });

  return Array.from(new Set(highlights)).slice(0, 5);
}

function formatResults(results: SearchResult[], limit: number) {
  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

function parseList(input?: string): string[] | undefined {
  if (!input) return undefined;
  const list = input
    .split(",")
    .map(value => value.trim())
    .filter(Boolean);
  return list.length ? list : undefined;
}

export async function registerSearchRoutes(app: FastifyInstance) {
  // Register rate limiting for search endpoints to prevent abuse
  await app.register(rateLimit, {
    ...rateLimitConfig.api,
    max: 30, // Lower limit for search (expensive operation)
    timeWindow: '1 minute',
    keyGenerator: (request) => {
      // Rate limit by IP for search endpoints
      return `search:${request.ip}`;
    },
  });

  app.get("/api/search", async (req, reply) => {
    try {
      const parsed = searchQuerySchema.safeParse(req.query);
      if (!parsed.success) {
        return reply.code(400).send(fail("Invalid search query", parsed.error.issues));
      }

      const { q, limit, highlight, type, category, location, from, to } = parsed.data;
      const typeFilters = (parseList(type) as SearchType[] | undefined)?.filter((value): value is SearchType =>
        ["fighter", "event", "news", "club"].includes(value)
      );
      const categoryFilters = parseList(category);
      const locationFilters = parseList(location);

      const appliedTypes = typeFilters?.length ? typeFilters : DEFAULT_TYPE_ORDER;
      const perTypeLimit = Math.max(5, Math.ceil(limit / appliedTypes.length));

      const [fighters, events, news, clubs] = await Promise.all([
        appliedTypes.includes("fighter")
          ? prisma.fighter.findMany({
              where: {
                deletedAt: null,
                OR: [
                  { name: { contains: q, mode: "insensitive" } },
                  { nickname: { contains: q, mode: "insensitive" } },
                  { country: { contains: q, mode: "insensitive" } }
                ],
                ...(locationFilters && {
                  AND: [
                    {
                      OR: locationFilters.map(location => ({
                        country: { contains: location, mode: "insensitive" as const }
                      }))
                    }
                  ]
                })
              },
              take: perTypeLimit,
              select: {
                id: true,
                name: true,
                nickname: true,
                country: true,
                imageUrl: true,
                weightClass: true,
              }
            })
          : [],
        appliedTypes.includes("event")
          ? prisma.event.findMany({
              where: {
                deletedAt: null,
                OR: [
                  { name: { contains: q, mode: "insensitive" } },
                  { city: { contains: q, mode: "insensitive" } },
                  { country: { contains: q, mode: "insensitive" } }
                ],
                ...(locationFilters && {
                  AND: [
                    {
                      OR: locationFilters.flatMap(location => ([
                        { city: { contains: location, mode: "insensitive" as const } },
                        { country: { contains: location, mode: "insensitive" as const } }
                      ]))
                    }
                  ]
                }),
                ...(from && { startAt: { gte: from } }),
                ...(to && { startAt: { lte: to } })
              },
              take: perTypeLimit,
              select: {
                id: true,
                name: true,
                city: true,
                country: true,
                startAt: true,
                posterUrl: true,
              }
            })
          : [],
        appliedTypes.includes("news")
          ? prisma.news.findMany({
              where: {
                deletedAt: null,
                OR: [
                  { title: { contains: q, mode: "insensitive" } },
                  { content: { contains: q, mode: "insensitive" } },
                  { authorName: { contains: q, mode: "insensitive" } }
                ],
                ...(categoryFilters && {
                  AND: [
                    {
                      OR: categoryFilters.map(value => ({
                        category: { equals: value, mode: "insensitive" as const }
                      }))
                    }
                  ]
                })
              },
              orderBy: { publishAt: "desc" },
              take: perTypeLimit,
              select: {
                id: true,
                title: true,
                excerpt: true,
                category: true,
                publishAt: true,
                imageUrl: true,
              }
            })
          : [],
        appliedTypes.includes("club")
          ? prisma.club.findMany({
              where: {
                deletedAt: null,
                OR: [
                  { name: { contains: q, mode: "insensitive" } },
                  { city: { contains: q, mode: "insensitive" } },
                  { country: { contains: q, mode: "insensitive" } }
                ],
                ...(locationFilters && {
                  AND: [
                    {
                      OR: locationFilters.flatMap(location => ([
                        { city: { contains: location, mode: "insensitive" as const } },
                        { country: { contains: location, mode: "insensitive" as const } }
                      ]))
                    }
                  ]
                })
              },
              take: perTypeLimit,
              select: {
                id: true,
                name: true,
                city: true,
                country: true,
                description: true,
                logoUrl: true,
              }
            })
          : [],
      ]);

      const results: SearchResult[] = [];

      fighters.forEach(fighter => {
        const fields = [fighter.name, fighter.nickname, fighter.country];
        const entry: SearchResult = {
          id: fighter.id,
          type: "fighter",
          title: fighter.name,
          url: `/fighters/${fighter.id}`,
          score: computeScore(fields, q),
          highlights: collectHighlights(fields, q, highlight)
        };

        const subtitle = fighter.nickname ?? fighter.country ?? null;
        if (subtitle) {
          entry.subtitle = subtitle;
        }

        if (fighter.weightClass) {
          entry.description = `Weight class: ${fighter.weightClass}`;
        }

        if (fighter.imageUrl) {
          entry.image = fighter.imageUrl;
        }

        results.push(entry);
      });

      events.forEach(event => {
        const fields = [event.name, event.city, event.country];
        const entry: SearchResult = {
          id: event.id,
          type: "event",
          title: event.name,
          url: `/events/${event.id}`,
          score: computeScore(fields, q),
          highlights: collectHighlights(fields, q, highlight)
        };

        const subtitle = [event.city, event.country].filter(Boolean).join(", ");
        if (subtitle) {
          entry.subtitle = subtitle;
        }

        if (event.startAt) {
          entry.description = `Početak: ${event.startAt.toISOString()}`;
        }

        if (event.posterUrl) {
          entry.image = event.posterUrl;
        }

        results.push(entry);
      });

      news.forEach(article => {
        const fields = [article.title, article.excerpt, article.category];
        const entry: SearchResult = {
          id: article.id,
          type: "news",
          title: article.title,
          url: `/news/${article.id}`,
          score: computeScore(fields, q),
          highlights: collectHighlights(fields, q, highlight)
        };

        if (article.category) {
          entry.subtitle = article.category;
        }

        if (article.excerpt) {
          entry.description = article.excerpt;
        }

        if (article.imageUrl) {
          entry.image = article.imageUrl;
        }

        results.push(entry);
      });

      clubs.forEach(club => {
        const fields = [club.name, club.city, club.country];
        const entry: SearchResult = {
          id: club.id,
          type: "club",
          title: club.name,
          url: `/clubs/${club.id}`,
          score: computeScore(fields, q),
          highlights: collectHighlights(fields, q, highlight)
        };

        const subtitle = [club.city, club.country].filter(Boolean).join(", ");
        if (subtitle) {
          entry.subtitle = subtitle;
        }

        if (club.description) {
          entry.description = club.description;
        }

        if (club.logoUrl) {
          entry.image = club.logoUrl;
        }

        results.push(entry);
      });

      return ok(formatResults(results, limit));
    } catch (error) {
      ErrorLogger.log(error as Error, { context: "search" });
      return reply.code(500).send(fail("Unable to perform search"));
    }
  });

  app.get("/api/search/suggestions", async (req, reply) => {
    try {
      const parsed = suggestionsQuerySchema.safeParse(req.query);
      if (!parsed.success) {
        return reply.code(400).send(fail("Invalid suggestion query", parsed.error.issues));
      }

      const { q, limit } = parsed.data;
      const perTypeLimit = Math.max(3, Math.ceil(limit / DEFAULT_TYPE_ORDER.length));

      const [fighterNames, eventNames, newsTitles, clubNames] = await Promise.all([
        prisma.fighter.findMany({
          where: {
            deletedAt: null,
            name: { contains: q, mode: "insensitive" },
          },
          select: { id: true, name: true },
          take: perTypeLimit,
        }),
        prisma.event.findMany({
          where: {
            deletedAt: null,
            name: { contains: q, mode: "insensitive" },
          },
          select: { id: true, name: true },
          take: perTypeLimit,
        }),
        prisma.news.findMany({
          where: {
            deletedAt: null,
            title: { contains: q, mode: "insensitive" },
          },
          select: { id: true, title: true },
          take: perTypeLimit,
        }),
        prisma.club.findMany({
          where: {
            deletedAt: null,
            name: { contains: q, mode: "insensitive" },
          },
          select: { id: true, name: true },
          take: perTypeLimit,
        }),
      ]);

      const suggestions = [
        ...fighterNames.map(fighter => ({ id: fighter.id, text: fighter.name, type: "fighter" as const })),
        ...eventNames.map(event => ({ id: event.id, text: event.name, type: "event" as const })),
        ...newsTitles.map(article => ({ id: article.id, text: article.title, type: "news" as const })),
        ...clubNames.map(club => ({ id: club.id, text: club.name, type: "club" as const })),
      ].slice(0, limit);

      return ok(suggestions);
    } catch (error) {
      ErrorLogger.log(error as Error, { context: "search_suggestions" });
      return reply.code(500).send(fail("Unable to fetch suggestions"));
    }
  });
}
