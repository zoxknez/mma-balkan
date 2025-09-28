import type { FastifyInstance } from "fastify";
import { fail } from "../lib/apiResponse";

export async function registerErrorHandler(app: FastifyInstance) {
  app.setErrorHandler((err: unknown, _req, reply) => {
    const e = err as { statusCode?: number; validation?: unknown; message?: string };
    const status = e.statusCode ?? 500;
    reply.code(status).send(
      fail(
        process.env.NODE_ENV === "production" ? "Internal Server Error" : (e.message ?? "Error"),
        e.validation ?? undefined
      )
    );
  });

  app.setNotFoundHandler((_req, reply) => {
    reply.code(404).send(fail("Not Found"));
  });
}
