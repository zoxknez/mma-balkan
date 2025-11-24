import type { FastifyInstance } from "fastify";
import rateLimit from "@fastify/rate-limit";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { ok, fail } from "../lib/apiResponse";
import { prisma } from "../lib/prisma";
import { rateLimitConfig } from "../lib/auth";
import { createValidatedRoute, ValidatedRequest } from "../lib/validationMiddleware";

export async function registerNewsRoutes(app: FastifyInstance) {
  // Apply rate limiting to all news routes
  await app.register(rateLimit, rateLimitConfig.api);

  const q = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    category: z.string().optional(),
    featured: z.coerce.boolean().optional(),
    trending: z.coerce.boolean().optional(),
    search: z.string().optional(),
  });
  const idParam = z.object({ id: z.string().cuid('Invalid news identifier') });
  const latestQuery = z.object({ limit: z.coerce.number().int().min(1).max(20).default(3) });
  const likeQuery = z.object({ action: z.enum(['inc', 'dec']).default('inc') });

  type NewsQuery = z.infer<typeof q>;
  type NewsIdParams = z.infer<typeof idParam>;
  type LatestQuery = z.infer<typeof latestQuery>;
  type LikeQuery = z.infer<typeof likeQuery>;

  app.get("/api/news", createValidatedRoute(
    { query: q },
    async (req: ValidatedRequest<unknown, NewsQuery>, reply) => {
      const { page, limit, category, featured, trending, search } = req.validatedQuery!;

      const where: Prisma.NewsWhereInput = {
        deletedAt: null,
      };
      
      if (category) where.category = category;
      if (typeof featured !== 'undefined') where.featured = featured;
      if (typeof trending !== 'undefined') where.trending = trending;
      if (search) {
        where.OR = [
          { title: { contains: search, mode: "insensitive" } },
          { content: { contains: search, mode: "insensitive" } },
        ];
      }

      const [total, items] = await Promise.all([
        prisma.news.count({ where }),
        prisma.news.findMany({ where, orderBy: [{ publishAt: "desc" }], skip: (page - 1) * limit, take: limit }),
      ]);

      return ok(items, { page, limit, total, totalPages: Math.ceil(total / limit) });
    }
  ));

  app.get("/api/news/latest", createValidatedRoute(
    { query: latestQuery },
    async (req: ValidatedRequest<unknown, LatestQuery>) => {
      const { limit } = req.validatedQuery!;
      const items = await prisma.news.findMany({
        where: { deletedAt: null },
        orderBy: [{ publishAt: "desc" }],
        take: limit
      });
      return ok(items);
    }
  ));

  app.get("/api/news/:id", createValidatedRoute(
    { params: idParam },
    async (req: ValidatedRequest<unknown, unknown, NewsIdParams>, reply) => {
      const { id } = req.validatedParams!;
      const item = await prisma.news.findFirst({ 
        where: { 
          id,
          deletedAt: null
        } 
      });
      if (!item) return reply.code(404).send(fail("News not found"));
      return ok(item);
    }
  ));

  // Increment views
  app.post("/api/news/:id/view", {
    config: { rateLimit: rateLimitConfig.strict }
  }, createValidatedRoute(
    { params: idParam },
    async (req: ValidatedRequest<unknown, unknown, NewsIdParams>, reply) => {
      const { id } = req.validatedParams!;

      const exists = await prisma.news.findFirst({
        where: { id, deletedAt: null },
        select: { id: true }
      });
      
      if (!exists) {
        return reply.code(404).send(fail("News not found"));
      }
      
      try {
        const updated = await prisma.news.update({ 
          where: { id }, 
          data: { views: { increment: 1 } } 
        });
        return ok({ views: updated.views });
      } catch {
        return reply.code(404).send(fail("News not found"));
      }
    }
  ));

  // Toggle like (stateless simple increment or decrement based on query)
  app.post("/api/news/:id/like", {
    config: { rateLimit: rateLimitConfig.strict }
  }, createValidatedRoute(
    { params: idParam, query: likeQuery },
    async (req: ValidatedRequest<unknown, LikeQuery, NewsIdParams>, reply) => {
      const { id } = req.validatedParams!;
      const { action } = req.validatedQuery!;
      const delta = action === "dec" ? -1 : 1;

      try {
        const likes = await prisma.$transaction(async (tx) => {
          const item = await tx.news.findFirst({
            where: { id, deletedAt: null },
            select: { likes: true }
          });

          if (!item) {
            return null;
          }

          const nextLikes = Math.max(0, item.likes + delta);
          const updated = await tx.news.update({
            where: { id },
            data: { likes: nextLikes }
          });
          return updated.likes;
        });

        if (likes === null) {
          return reply.code(404).send(fail("News not found"));
        }

        return ok({ likes });
      } catch {
        return reply.code(404).send(fail("News not found"));
      }
    }
  ));
}
