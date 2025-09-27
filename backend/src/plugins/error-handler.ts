import type { FastifyInstance } from "fastify";
import { fail } from "../lib/apiResponse";

export async function registerErrorHandler(app: FastifyInstance) {
  app.setErrorHandler((err, _req, reply) => {
    const status = (err as any).statusCode ?? 500;
    reply.code(status).send(
      fail(
        process.env.NODE_ENV === "production" ? "Internal Server Error" : (err as Error).message,
        (err as any).validation ?? undefined
      )
    );
  });

  app.setNotFoundHandler((_req, reply) => {
    reply.code(404).send(fail("Not Found"));
  });
}
