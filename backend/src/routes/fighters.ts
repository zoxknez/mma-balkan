import type { FastifyInstance } from "fastify";
import { z } from "zod";
import rateLimit from "@fastify/rate-limit";
import { Prisma } from "@prisma/client";
import { ok, fail } from "../lib/apiResponse";
import { fighterSchemas } from "../lib/validation";
import { createValidatedRoute, ValidatedRequest } from "../lib/validationMiddleware";
import { authenticate, requireRole, rateLimitConfig } from "../lib/auth";
import { FighterService } from "../services/fighter.service";
import { NotFoundError, ValidationError } from "../lib/errors";

export async function registerFighterRoutes(app: FastifyInstance) {
  // Apply rate limiting to all fighter routes
  await app.register(rateLimit, { ...rateLimitConfig.api });

  // GET /api/fighters - List fighters with validation
  app.get("/api/fighters", createValidatedRoute(
    { query: fighterSchemas.query },
    async (req: ValidatedRequest<unknown, typeof fighterSchemas.query._type>, reply) => {
      try {
        const { page, limit, search, country, weightClass, active } = req.validatedQuery!;

        const filters = {
          page,
          limit,
          ...(search ? { search } : {}),
          ...(country ? { country } : {}),
          ...(typeof weightClass !== 'undefined' ? { weightClass } : {}),
          ...(typeof active !== 'undefined' ? { isActive: active } : {}),
        };

        const result = await FighterService.getFighters(filters);

        return ok(result.data, result.pagination);
      } catch (error) {
        if (error instanceof ValidationError) {
          return reply.code(400).send(fail(error.message));
        }
        throw error;
      }
    }
  ));

  // GET /api/fighters/trending - Trending fighters
  app.get("/api/fighters/trending", createValidatedRoute(
    { query: z.object({ limit: z.coerce.number().int().min(1).max(50).default(10) }) },
    async (req: ValidatedRequest<unknown, { limit: number }>, reply) => {
      try {
        const { limit } = req.validatedQuery!;
        const result = await FighterService.getTrendingFighters(limit);
        return ok(result.data);
      } catch (error) {
        throw error;
      }
    }
  ));

  // GET /api/fighters/:id - Get single fighter
  app.get("/api/fighters/:id", createValidatedRoute(
    { params: z.object({ id: z.string().cuid() }) },
    async (req: ValidatedRequest<unknown, unknown, { id: string }>, reply) => {
      try {
        const { id } = req.validatedParams!;
        const result = await FighterService.getFighterById(id);
        return ok(result.data);
      } catch (error) {
        if (error instanceof NotFoundError) {
          return reply.code(404).send(fail(error.message));
        }
        throw error;
      }
    }
  ));

  // POST /api/fighters - Create fighter (Admin only)
  app.post("/api/fighters", {
    preHandler: [authenticate, requireRole(['admin'])],
  }, createValidatedRoute(
      { body: fighterSchemas.create },
      async (req: ValidatedRequest<typeof fighterSchemas.create._type>, reply) => {
        try {
          const data = req.validatedBody! as Prisma.FighterCreateInput;
          const result = await FighterService.createFighter(data);
          return reply.code(201).send(ok(result.data));
        } catch (error) {
          if (error instanceof ValidationError) {
            return reply.code(400).send(fail(error.message));
          }
          throw error;
        }
      }
    )
  );

  // PUT /api/fighters/:id - Update fighter (Admin only)
  app.put("/api/fighters/:id", {
    preHandler: [authenticate, requireRole(['admin'])],
  }, createValidatedRoute(
      { 
        params: z.object({ id: z.string().cuid() }),
        body: fighterSchemas.update 
      },
      async (req: ValidatedRequest<typeof fighterSchemas.update._type, unknown, { id: string }>, reply) => {
        try {
          const { id } = req.validatedParams!;
          const data = req.validatedBody! as Prisma.FighterUpdateInput;
          
          const result = await FighterService.updateFighter(id, data);
          return ok(result.data);
        } catch (error) {
          if (error instanceof NotFoundError) {
            return reply.code(404).send(fail(error.message));
          }
          if (error instanceof ValidationError) {
            return reply.code(400).send(fail(error.message));
          }
          throw error;
        }
      }
    )
  );

  // DELETE /api/fighters/:id - Soft delete fighter (Admin only)
  app.delete("/api/fighters/:id", {
    preHandler: [authenticate, requireRole(['admin'])],
  }, createValidatedRoute(
      { params: z.object({ id: z.string().cuid() }) },
      async (req: ValidatedRequest<unknown, unknown, { id: string }>, reply) => {
        try {
          const { id } = req.validatedParams!;
          const result = await FighterService.deleteFighter(id);
          return ok(result);
        } catch (error) {
          if (error instanceof NotFoundError) {
            return reply.code(404).send(fail(error.message));
          }
          throw error;
        }
      }
    )
  );

  // Fighter fight history (completed)
  app.get("/api/fighters/:id/fights", createValidatedRoute(
    { params: z.object({ id: z.string().cuid() }) },
    async (req: ValidatedRequest<unknown, unknown, { id: string }>, reply) => {
      try {
        const { id } = req.validatedParams!;
        const result = await FighterService.getFighterFights(id);
        return ok(result.data);
      } catch (error) {
        if (error instanceof NotFoundError) {
          return reply.code(404).send(fail(error.message));
        }
        throw error;
      }
    }
  ));

  // Fighter upcoming fights
  app.get("/api/fighters/:id/upcoming", createValidatedRoute(
    { params: z.object({ id: z.string().cuid() }) },
    async (req: ValidatedRequest<unknown, unknown, { id: string }>, reply) => {
      try {
        const { id } = req.validatedParams!;
        const result = await FighterService.getFighterUpcomingFights(id);
        return ok(result.data);
      } catch (error) {
        if (error instanceof NotFoundError) {
          return reply.code(404).send(fail(error.message));
        }
        throw error;
      }
    }
  ));
}
