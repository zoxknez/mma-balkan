import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { ok, fail } from "../lib/apiResponse";

const q = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
});

export async function registerClubRoutes(app: FastifyInstance) {
  app.get("/api/clubs", async (req, reply) => {
    const parsed = q.safeParse((req as any).query);
    if (!parsed.success) return reply.code(400).send(fail("Invalid query", parsed.error.issues));
    const { page, limit, search, city, country } = parsed.data;

    const where: any = {};
    if (search)
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { city: { contains: search, mode: "insensitive" } },
      ];
    if (city) where.city = { contains: city, mode: "insensitive" };
    if (country) where.country = { contains: country, mode: "insensitive" };

    const [total, items] = await Promise.all([
      prisma.club.count({ where }),
      prisma.club.findMany({ where, orderBy: [{ name: "asc" }], skip: (page - 1) * limit, take: limit }),
    ]);

    return ok(items, { page, limit, total, totalPages: Math.ceil(total / limit) });
  });

  app.get("/api/clubs/:id", async (req, reply) => {
    const id = (req.params as any).id as string;
    if (!id) return reply.code(400).send(fail("Missing club id"));
    const club = await prisma.club.findUnique({ where: { id } });
    if (!club) return reply.code(404).send(fail("Club not found"));
    return ok(club);
  });
}
