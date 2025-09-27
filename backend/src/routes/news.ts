import type { FastifyInstance } from "fastify";
import { ok } from "../lib/apiResponse";

export async function registerNewsRoutes(app: FastifyInstance) {
  app.get("/api/news", async () => ok([]));
  app.get("/api/news/:id", async () => ok({}));
}
