import Fastify from "fastify";
import cors from "@fastify/cors";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import { registerErrorHandler } from "./plugins/error-handler";
import { registerClubRoutes } from "./routes/clubs";
import { registerFighterRoutes } from "./routes/fighters";
import { registerEventRoutes } from "./routes/events";
import { registerNewsRoutes } from "./routes/news";

const PORT = Number(process.env.PORT || 3001);
const ORIGIN = process.env.ORIGIN || "http://localhost:3000";

async function bootstrap() {
  const app = Fastify({ logger: true });

  await app.register(cors, { origin: ORIGIN });
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

  await app.listen({ port: PORT, host: "0.0.0.0" });
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
