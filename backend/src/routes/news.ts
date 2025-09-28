import type { FastifyInstance } from "fastify";
import { ok, fail } from "../lib/apiResponse";
import { prisma } from "../lib/prisma";
import { z } from "zod";

export async function registerNewsRoutes(app: FastifyInstance) {
  const q = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    category: z.string().optional(),
    featured: z.coerce.boolean().optional(),
    trending: z.coerce.boolean().optional(),
    search: z.string().optional(),
  });

  app.get("/api/news", async (req, reply) => {
    const parsed = q.safeParse((req as { query: unknown }).query);
    if (!parsed.success) return reply.code(400).send(fail("Invalid query", parsed.error.issues));
    const { page, limit, category, featured, trending, search } = parsed.data;

  const where: Record<string, unknown> = {};
    if (category) where.category = category;
    if (featured !== undefined) where.featured = featured;
    if (trending !== undefined) where.trending = trending;
    if (search) where.OR = [{ title: { contains: search, mode: "insensitive" } }, { content: { contains: search, mode: "insensitive" } }];

    const [total, items] = await Promise.all([
      prisma.news.count({ where }),
      prisma.news.findMany({ where, orderBy: [{ publishAt: "desc" }], skip: (page - 1) * limit, take: limit }),
    ]);

    return ok(items, { page, limit, total, totalPages: Math.ceil(total / limit) });
  });

  app.get("/api/news/:id", async (req, reply) => {
    const id = (req.params as { id?: string }).id as string;
    const item = await prisma.news.findUnique({ where: { id } });
    if (!item) return reply.code(404).send(fail("News not found"));
    return ok(item);
  });

  // Increment views
  app.post("/api/news/:id/view", async (req, reply) => {
    const id = (req.params as { id?: string }).id as string;
    try {
      const updated = await prisma.news.update({ where: { id }, data: { views: { increment: 1 } } });
      return ok({ views: updated.views });
    } catch {
      return reply.code(404).send(fail("News not found"));
    }
  });

  // Toggle like (stateless simple increment or decrement based on query)
  app.post("/api/news/:id/like", async (req, reply) => {
    const id = (req.params as { id?: string }).id as string;
    const action = (req as { query?: { action?: string } }).query?.action ?? "inc";
    const delta = action === "dec" ? -1 : 1;
    try {
      const updated = await prisma.news.update({ where: { id }, data: { likes: { increment: delta } } });
      return ok({ likes: updated.likes });
    } catch {
      return reply.code(404).send(fail("News not found"));
    }
  });
}
