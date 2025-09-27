import type { FastifyInstance } from "fastify";
import { ok } from "../lib/apiResponse";

export async function registerFighterRoutes(app: FastifyInstance) {
  app.get("/api/fighters", async () => ok([]));
  app.get("/api/fighters/trending", async () => ok([]));
}
