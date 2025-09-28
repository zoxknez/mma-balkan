import type { FastifyInstance } from "fastify";
import { ok, fail } from "../lib/apiResponse";
import { prisma } from "../lib/prisma";
import { z } from "zod";

export async function registerFighterRoutes(app: FastifyInstance) {
  const q = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    search: z.string().optional(),
    country: z.string().optional(),
    weightClass: z.string().optional(),
    active: z.coerce.boolean().optional(),
  });

  app.get("/api/fighters", async (req, reply) => {
    const parsed = q.safeParse((req as { query: unknown }).query);
    if (!parsed.success) return reply.code(400).send(fail("Invalid query", parsed.error.issues));
    const { page, limit, search, country, weightClass, active } = parsed.data;

  const where: Record<string, unknown> = {};
    if (search)
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { nickname: { contains: search, mode: "insensitive" } },
      ];
    if (country) where.country = { contains: country, mode: "insensitive" };
    if (weightClass) where.weightClass = weightClass;
    if (active !== undefined) where.isActive = active;

    const [total, items] = await Promise.all([
      prisma.fighter.count({ where }),
      prisma.fighter.findMany({ where, orderBy: [{ wins: "desc" }, { name: "asc" }], skip: (page - 1) * limit, take: limit }),
    ]);

    return ok(items, { page, limit, total, totalPages: Math.ceil(total / limit) });
  });

  app.get("/api/fighters/trending", async (req) => {
    const limit = Number((req as { query?: { limit?: number | string } }).query?.limit ?? 10);
    // Simple trending heuristic: most wins and recently updated
    const items = await prisma.fighter.findMany({ orderBy: [{ wins: "desc" }, { updatedAt: "desc" }], take: Math.min(limit, 50) });
    return ok(items);
  });

  app.get("/api/fighters/:id", async (req, reply) => {
    const id = (req.params as { id?: string }).id as string;
    if (!id) return reply.code(400).send(fail("Missing fighter id"));
    const fighter = await prisma.fighter.findUnique({ where: { id } });
    if (!fighter) return reply.code(404).send(fail("Fighter not found"));
    return ok(fighter);
  });

  // Fighter fight history (completed)
  app.get("/api/fighters/:id/fights", async (req, reply) => {
    const id = (req.params as { id?: string }).id as string;
    if (!id) return reply.code(400).send(fail("Missing fighter id"));
    const fights = await prisma.fight.findMany({
      where: {
        OR: [{ redFighterId: id }, { blueFighterId: id }],
        status: "COMPLETED",
      },
      orderBy: [{ updatedAt: "desc" }],
      include: { event: true, redFighter: true, blueFighter: true },
    });
    return ok(fights);
  });

  // Fighter upcoming fights
  app.get("/api/fighters/:id/upcoming", async (req, reply) => {
    const id = (req.params as { id?: string }).id as string;
    if (!id) return reply.code(400).send(fail("Missing fighter id"));
    const fights = await prisma.fight.findMany({
      where: {
        OR: [{ redFighterId: id }, { blueFighterId: id }],
        status: { in: ["SCHEDULED", "UPCOMING"] },
      },
      orderBy: [{ orderNo: "asc" }],
      include: { event: true, redFighter: true, blueFighter: true },
    });
    return ok(fights);
  });
}
