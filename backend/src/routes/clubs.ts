import type { FastifyInstance } from "fastify";
import { z } from "zod";
import rateLimit from "@fastify/rate-limit";
import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { ok, fail } from "../lib/apiResponse";
import { rateLimitConfig } from "../lib/auth";

const q = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
});

export async function registerClubRoutes(app: FastifyInstance) {
  // Apply rate limiting to all club routes
  await app.register(rateLimit, rateLimitConfig.api);

  app.get("/api/clubs", async (req, reply) => {
    const parsed = q.safeParse((req as { query: unknown }).query);
    if (!parsed.success) return reply.code(400).send(fail("Invalid query", parsed.error.issues));
    const { page, limit, search, city, country } = parsed.data;

    const where: Prisma.ClubWhereInput = {
      deletedAt: null, // Exclude soft-deleted clubs
    };
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { city: { contains: search, mode: "insensitive" } },
      ];
    }
    if (city) {
      where.city = { contains: city, mode: "insensitive" };
    }
    if (country) {
      where.country = { contains: country, mode: "insensitive" };
    }

    const [total, items] = await Promise.all([
      prisma.club.count({ where }),
      prisma.club.findMany({ where, orderBy: [{ name: "asc" }], skip: (page - 1) * limit, take: limit }),
    ]);

    return ok(items, { page, limit, total, totalPages: Math.ceil(total / limit) });
  });

  app.get("/api/clubs/:id", async (req, reply) => {
    const id = (req.params as { id?: string }).id as string;
    if (!id) return reply.code(400).send(fail("Missing club id"));
    const club = await prisma.club.findFirst({ 
      where: { 
        id,
        deletedAt: null // Exclude soft-deleted
      } 
    });
    if (!club) return reply.code(404).send(fail("Club not found"));
    return ok(club);
  });
}
