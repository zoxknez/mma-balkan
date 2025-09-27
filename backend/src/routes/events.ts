import type { FastifyInstance } from "fastify";
import { ok, fail } from "../lib/apiResponse";
import { prisma } from "../lib/prisma";
import { z } from "zod";

export async function registerEventRoutes(app: FastifyInstance) {
  const q = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    city: z.string().optional(),
    country: z.string().optional(),
    status: z.string().optional(),
    from: z.coerce.date().optional(),
    to: z.coerce.date().optional(),
  });

  app.get("/api/events", async (req, reply) => {
    const parsed = q.safeParse((req as any).query);
    if (!parsed.success) return reply.code(400).send(fail("Invalid query", parsed.error.issues));
    const { page, limit, city, country, status, from, to } = parsed.data;

    const where: any = {};
    if (city) where.city = { contains: city, mode: "insensitive" };
    if (country) where.country = { contains: country, mode: "insensitive" };
    if (status) where.status = status;
    if (from || to) where.startAt = { gte: from, lte: to };

    const [total, items] = await Promise.all([
      prisma.event.count({ where }),
      prisma.event.findMany({ where, orderBy: [{ startAt: "desc" }], skip: (page - 1) * limit, take: limit }),
    ]);

    return ok(items, { page, limit, total, totalPages: Math.ceil(total / limit) });
  });

  app.get("/api/events/upcoming", async () => {
    const now = new Date();
    const items = await prisma.event.findMany({ where: { startAt: { gt: now }, status: { in: ["SCHEDULED", "UPCOMING"] } }, orderBy: [{ startAt: "asc" }], take: 20 });
    return ok(items);
  });

  app.get("/api/events/live", async () => {
    const items = await prisma.event.findMany({ where: { status: { in: ["LIVE"] } }, orderBy: [{ startAt: "desc" }], take: 20 });
    return ok(items);
  });
}
