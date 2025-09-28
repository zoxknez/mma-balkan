import Fastify from "fastify";
import cors from "@fastify/cors";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import { registerErrorHandler } from "./plugins/error-handler";
import { registerClubRoutes } from "./routes/clubs";
import { registerFighterRoutes } from "./routes/fighters";
import { registerEventRoutes } from "./routes/events";
import { registerNewsRoutes } from "./routes/news";

const BASE_PORT = Number(process.env.PORT || 3003);
// ORIGIN kept configurable via env in case we tighten CORS later

async function bootstrap() {
  const app = Fastify({ logger: true });

  // CORS: u produkciji dozvoli poznate origin-e; u dev slobodno (ili true zbog lokalnog testiranja bez rewrites)
  const allowedProdOrigins = [
    process.env.ORIGIN,
    'https://mma-balkan.org',
  ].filter(Boolean) as string[];
  await app.register(cors, { 
    origin: process.env.NODE_ENV === 'production' ? allowedProdOrigins : true,
    credentials: true,
  });
  await app.register(swagger, {
    openapi: { info: { title: "MMA Serbia API", version: "0.1.0" } },
  });
  await app.register(swaggerUI, { routePrefix: "/docs" });

  app.get("/healthz", async () => ({ status: "ok", time: new Date().toISOString() }));

  await registerClubRoutes(app);
  await registerFighterRoutes(app);
  await registerEventRoutes(app);
  await registerNewsRoutes(app);
  await registerErrorHandler(app);

  // Try preferred port and retry on EADDRINUSE by incrementing
  let port = BASE_PORT;
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      await app.listen({ port, host: "0.0.0.0" });
      app.log.info({ msg: `Bound on port ${port}` });
      return;
    } catch (err: unknown) {
      const e = err as NodeJS.ErrnoException;
      if (e && e.code === 'EADDRINUSE') {
        app.log.warn({ msg: `Port ${port} in use, retrying on ${port + 1}` });
        port += 1;
        continue;
      }
      throw err;
    }
  }
  throw new Error(`Unable to bind backend after retries starting from ${BASE_PORT}`);
}

bootstrap().catch((err) => {
  // Use Fastify logger if available
  try {
    // eslint-disable-next-line no-console
    console.error(err);
  } finally {
    process.exit(1);
  }
});
