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
    const parsed = q.safeParse((req as { query: unknown }).query);
    if (!parsed.success) return reply.code(400).send(fail("Invalid query", parsed.error.issues));
    const { page, limit, city, country, status, from, to } = parsed.data;

  const where: Record<string, unknown> = {};
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

  // SSE stream (Server-Sent Events)
  app.get("/api/events/live", async (_req, _reply) => {
    // JSON fallback za klijente koji ne koriste SSE
    const items = await prisma.event.findMany({ where: { status: { in: ["LIVE"] } }, orderBy: [{ startAt: "desc" }], take: 20 });
    return ok(items);
  });

  // Dedicated SSE-only endpoint da izbegnemo proxy/Accept edge-caseove
  app.get("/api/events/live/stream", async (req, reply) => {
    reply.raw.setHeader('Content-Type', 'text/event-stream');
    reply.raw.setHeader('Cache-Control', 'no-store');
    reply.raw.setHeader('Connection', 'keep-alive');
    reply.raw.setHeader('X-Accel-Buffering', 'no');
    (reply.raw as unknown as { flushHeaders?: () => void }).flushHeaders?.();

    const send = (event: string, data: unknown) => {
      reply.raw.write(`event: ${event}\n` + `data: ${JSON.stringify(data)}\n\n`);
    };

    // inicijalni payload
    const initial = await prisma.event.findMany({ where: { status: { in: ["LIVE"] } }, orderBy: [{ startAt: "desc" }], take: 20 });
    send('hello', { status: 'ok', data: initial });

    // heartbeat na 15s
    const hb = setInterval(() => send('tick', { t: Date.now() }), 15000);
    req.raw.on('close', () => clearInterval(hb));

    return reply; // ostavi konekciju otvorenom
  });

  app.get("/api/events/:id", async (req, reply) => {
    const id = (req.params as { id?: string }).id as string;
    if (!id) return reply.code(400).send(fail("Missing event id"));
    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) return reply.code(404).send(fail("Event not found"));
    return ok(event);
  });

  // Event fights (card)
  app.get("/api/events/:id/fights", async (req, reply) => {
    const id = (req.params as { id?: string }).id as string;
    if (!id) return reply.code(400).send(fail("Missing event id"));
    const fights = await prisma.fight.findMany({
      where: { eventId: id },
      orderBy: [{ orderNo: "asc" }],
      include: {
        redFighter: true,
        blueFighter: true,
      },
    });
    return ok(fights);
  });
}
