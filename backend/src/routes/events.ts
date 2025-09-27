import type { FastifyInstance } from "fastify";
import { ok } from "../lib/apiResponse";

export async function registerEventRoutes(app: FastifyInstance) {
  app.get("/api/events", async () => ok([]));
  app.get("/api/events/upcoming", async () => ok([]));
  app.get("/api/events/live", async () => ok([]));
}
