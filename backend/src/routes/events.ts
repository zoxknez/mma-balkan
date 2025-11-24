import type { FastifyInstance } from "fastify";
import rateLimit from "@fastify/rate-limit";
import { z } from "zod";
import { ok, fail } from "../lib/apiResponse";
import { eventSchemas } from "../lib/validation";
import { createValidatedRoute, ValidatedRequest } from "../lib/validationMiddleware";
import { rateLimitConfig } from "../lib/auth";
import { EventService } from "../services/event.service";
import { NotFoundError, ValidationError } from "../lib/errors";

export async function registerEventRoutes(app: FastifyInstance) {
  // Apply rate limiting to all event routes
  await app.register(rateLimit, rateLimitConfig.api);

  const idParam = z.object({ id: z.string().cuid('Invalid event identifier') });

  // GET /api/events - List events with filters
  app.get("/api/events", createValidatedRoute(
    { query: eventSchemas.query },
    async (req: ValidatedRequest<unknown, typeof eventSchemas.query._type>, reply) => {
      try {
        const { page, limit, city, country, status, from, to } = req.validatedQuery!;

        const filters = {
          page,
          limit,
          ...(city ? { city } : {}),
          ...(country ? { country } : {}),
          ...(status ? { status } : {}),
          ...(from ? { from } : {}),
          ...(to ? { to } : {}),
        };
        
        const result = await EventService.getEvents(filters);

        return ok(result.data, result.pagination);
      } catch (error) {
        if (error instanceof ValidationError) {
          return reply.code(400).send(fail(error.message));
        }
        throw error;
      }
    }
  ));

  // GET /api/events/upcoming
  app.get("/api/events/upcoming", async (req, reply) => {
    try {
      const result = await EventService.getUpcomingEvents();
      return ok(result.data);
    } catch (error) {
      throw error;
    }
  });

  // GET /api/events/featured
  app.get("/api/events/featured", async (req, reply) => {
    try {
      const result = await EventService.getFeaturedEvent();
      return ok(result.data);
    } catch (error) {
      if (error instanceof NotFoundError) {
        return reply.code(404).send(fail(error.message));
      }
      throw error;
    }
  });

  // GET /api/events/live (JSON fallback)
  app.get("/api/events/live", async (req, reply) => {
    try {
      const result = await EventService.getLiveEvents();
      return ok(result.data);
    } catch (error) {
      throw error;
    }
  });

  // SSE stream (Server-Sent Events)
  // Keeping this logic here as it's specific to the transport layer (HTTP streaming)
  app.get("/api/events/live/stream", async (req, reply) => {
    reply.raw.setHeader('Content-Type', 'text/event-stream');
    reply.raw.setHeader('Cache-Control', 'no-store');
    reply.raw.setHeader('Connection', 'keep-alive');
    reply.raw.setHeader('X-Accel-Buffering', 'no');
    (reply.raw as unknown as { flushHeaders?: () => void }).flushHeaders?.();

    const send = (event: string, data: unknown) => {
      reply.raw.write(`event: ${event}\n` + `data: ${JSON.stringify(data)}\n\n`);
    };

    // Initial payload
    try {
      const result = await EventService.getLiveEvents();
      send('hello', { status: 'ok', data: result.data });
    } catch (error) {
      send('error', { message: 'Failed to fetch initial data' });
    }

    // Heartbeat every 15s
    const hb = setInterval(() => send('tick', { t: Date.now() }), 15000);
    
    // Poll for updates every 30s (simulated real-time)
    const poll = setInterval(async () => {
      try {
        const result = await EventService.getLiveEvents();
        send('update', { data: result.data });
      } catch (error) {
        // Silent fail on poll error
      }
    }, 30000);

    req.raw.on('close', () => {
      clearInterval(hb);
      clearInterval(poll);
    });

    return reply; // Keep connection open
  });

  // GET /api/events/:id
  app.get("/api/events/:id", createValidatedRoute(
    { params: idParam },
    async (req: ValidatedRequest<unknown, unknown, { id: string }>, reply) => {
      const { id } = req.validatedParams!;
      try {
        const result = await EventService.getEventById(id);
        return ok(result.data);
      } catch (error) {
        if (error instanceof NotFoundError) {
          return reply.code(404).send(fail(error.message));
        }
        throw error;
      }
    }
  ));

  // GET /api/events/:id/fights
  app.get("/api/events/:id/fights", createValidatedRoute(
    { params: idParam },
    async (req: ValidatedRequest<unknown, unknown, { id: string }>, reply) => {
      const { id } = req.validatedParams!;
      try {
        const result = await EventService.getEventFights(id);
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
