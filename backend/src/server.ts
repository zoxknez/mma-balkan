import "dotenv/config";
import Fastify from "fastify";
import cors from "@fastify/cors";
import cookie from "@fastify/cookie";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import rateLimit from "@fastify/rate-limit";
import helmet from "@fastify/helmet";
import jwt from "@fastify/jwt";
import { randomUUID } from "crypto";
import { env } from "./lib/env.js";
import { MonitoringService, MetricsService } from "./lib/monitoring.js";
import { cache } from "./lib/cache.js";
import { getCSRFToken } from "./lib/csrf.js";
import { registerErrorHandler } from "./plugins/error-handler.js";
import { registerAuthRoutes } from "./routes/auth.js";
import { registerClubRoutes } from "./routes/clubs.js";
import { registerFighterRoutes } from "./routes/fighters.js";
import { registerEventRoutes } from "./routes/events.js";
import { registerNewsRoutes } from "./routes/news.js";
import { registerActivityRoutes } from "./routes/activity.js";
import { registerUserRoutes } from "./routes/users.js";
import { registerSearchRoutes } from "./routes/search.js";
import { rateLimitConfig } from "./lib/auth.js";

// Graceful shutdown handler
let server: ReturnType<typeof Fastify> | null = null;

const BASE_PORT = env.PORT;

// Initialize monitoring and cache
Promise.all([
  MonitoringService.initialize(),
  cache.initialize(),
]).catch(err => {
  console.error('Failed to initialize services:', err);
});

async function bootstrap() {
  const app = Fastify({ 
    logger: {
      level: env.NODE_ENV === 'production' ? 'warn' : 'info'
    },
    requestIdHeader: 'x-request-id',
    requestIdLogLabel: 'requestId',
    genReqId: () => randomUUID(),
    trustProxy: true, // Important for proxy setups (nginx, cloudflare)
  });

  // Store app reference for graceful shutdown
  server = app;

  // Compression (gzip/brotli/deflate)
  try {
    const compress = await import('@fastify/compress');
    await app.register(compress.default, {
      global: true,
      threshold: 1024, // Only compress responses > 1KB
      encodings: ['gzip', 'deflate', 'br'], // Support brotli, gzip, deflate
      brotliOptions: {
        params: {
          [require('zlib').constants.BROTLI_PARAM_MODE]: require('zlib').constants.BROTLI_MODE_TEXT,
          [require('zlib').constants.BROTLI_PARAM_QUALITY]: 4, // Balance between compression & speed
        },
      },
      zlibOptions: {
        level: 6, // Balance between compression & speed
      },
    });
    app.log.info('✅ Compression enabled (gzip/brotli)');
  } catch (error) {
    app.log.warn('⚠️  @fastify/compress not installed. Install with: npm install @fastify/compress');
  }

  // ETag support for caching
  try {
    const etag = await import('@fastify/etag');
    await app.register(etag.default);
    app.log.info('✅ ETag support enabled');
  } catch (error) {
    app.log.warn('⚠️  @fastify/etag not installed. Install with: npm install @fastify/etag');
  }

  // Enhanced security headers with Helmet
  await app.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        baseUri: ["'self'"],
        fontSrc: ["'self'", "https:", "data:"],
        formAction: ["'self'"],
        frameAncestors: ["'self'"],
        imgSrc: ["'self'", "data:", "https:", "blob:"],
        objectSrc: ["'none'"],
        scriptSrc: ["'self'"],
        scriptSrcAttr: ["'none'"],
        styleSrc: env.NODE_ENV === 'production'
          ? ["'self'"]
          : ["'self'", "'unsafe-inline'"],
        upgradeInsecureRequests: env.NODE_ENV === 'production' ? [] : null,
        connectSrc: ["'self'", ...(env.ALLOWED_ORIGINS || [])],
        fetchSrc: ["'self'"],
      },
    },
    crossOriginEmbedderPolicy: env.NODE_ENV === 'production',
    crossOriginOpenerPolicy: { policy: "same-origin" },
    crossOriginResourcePolicy: { policy: "same-origin" },
    dnsPrefetchControl: { allow: false },
    frameguard: { action: "deny" },
    hsts: {
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: true,
    },
    ieNoOpen: true,
    noSniff: true,
    originAgentCluster: true,
    permittedCrossDomainPolicies: { permittedPolicies: "none" },
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    xssFilter: true,
  });

  // Rate limiting
  await app.register(rateLimit, rateLimitConfig.global);

  // Cookie support
  await app.register(cookie, {
    secret: env.JWT_SECRET, // Use JWT secret for cookie signing
    hook: 'onRequest',
    parseOptions: {}
  });

  // JWT authentication
  await app.register(jwt, {
    secret: env.JWT_SECRET
  });

  // CORS configuration with proper origin validation
  const getAllowedOrigins = (): string[] | boolean => {
    if (env.NODE_ENV === 'development') {
      return true; // Allow all origins in development
    }
    
    // In production, use explicit whitelist
    const origins = [
      env.ORIGIN,
      ...env.ALLOWED_ORIGINS,
      'https://mma-balkan.org',
      'https://www.mma-balkan.org',
    ].filter((origin): origin is string => {
      return typeof origin === 'string' && origin.length > 0;
    });
    
    return origins.length > 0 ? origins : false;
  };

  await app.register(cors, { 
    origin: getAllowedOrigins(),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'Pragma', 'Expires'],
    exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset'],
    maxAge: 86400, // 24 hours
  });
  
  await app.register(swagger, {
    openapi: { 
      info: { 
        title: "MMA Balkan API", 
        version: "1.0.0",
        description: "API for MMA Balkan platform"
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
          }
        }
      },
      security: [
        {
          bearerAuth: []
        }
      ]
    }
  });
  await app.register(swaggerUI, { routePrefix: "/docs" });

  // Health check endpoint (no rate limit) - with comprehensive checks
  app.get("/healthz", async (req, reply) => {
    MetricsService.increment('healthcheck_requests');
    
    const health = {
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      checks: {
        database: "unknown" as "ok" | "error" | "unknown",
        cache: "unknown" as "ok" | "error" | "unknown",
      }
    };
    
    // Check database connection
    try {
      const { prisma } = await import('./lib/prisma.js');
      await prisma.$queryRaw`SELECT 1`;
      health.checks.database = "ok";
    } catch (error) {
      console.error('Database health check failed:', error);
      health.checks.database = "error";
      health.status = "degraded";
    }
    
    // Check cache connection
    try {
      await cache.exists('health-check-test');
      health.checks.cache = "ok";
    } catch (error) {
      console.error('Cache health check failed:', error);
      health.checks.cache = "error";
      // Cache failure is not critical
    }
    
    const statusCode = health.status === "ok" ? 200 : 503;
    return reply.code(statusCode).send(health);
  });

  // Metrics endpoint (Prometheus format)
  app.get("/metrics", async (req, reply) => {
    const metrics = MetricsService.toPrometheus();
    reply.header('Content-Type', 'text/plain');
    return metrics;
  });

  // CSRF token endpoint
  app.get("/api/csrf-token", async (req, reply) => {
    return getCSRFToken(req, reply);
  });

  // Register routes with rate limiting
  await registerAuthRoutes(app);
  await registerClubRoutes(app);
  await registerFighterRoutes(app);
  await registerEventRoutes(app);
  await registerNewsRoutes(app);
  await registerActivityRoutes(app);
  await registerUserRoutes(app);
  await registerSearchRoutes(app);
  
  // Error handler must be registered last
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

// Graceful shutdown handler
async function gracefulShutdown(signal: string) {
  console.log(`\n${signal} received. Starting graceful shutdown...`);
  
  if (!server) {
    console.log('No server instance to close');
    process.exit(0);
  }

  try {
    // Stop accepting new connections
    await server.close();
    console.log('✅ Server closed successfully');
    
    // Close database connections
    try {
      const { prisma } = await import('./lib/prisma.js');
      await prisma.$disconnect();
      console.log('✅ Database connections closed');
    } catch (error) {
      console.warn('⚠️  Database disconnect failed:', error);
    }
    
    // Close cache connections
    try {
      await cache.clear();
      console.log('✅ Cache cleared');
    } catch (error) {
      console.warn('⚠️  Cache clear failed:', error);
    }
    
    console.log('✅ Graceful shutdown complete');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
}

// Register signal handlers
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  MonitoringService.captureException(error, { fatal: true });
  gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  MonitoringService.captureException(new Error(String(reason)), { fatal: true });
});

// Start server
bootstrap().catch((err) => {
  // Use Fastify logger if available
  try {
    // eslint-disable-next-line no-console
    console.error('❌ Bootstrap failed:', err);
    MonitoringService.captureException(err);
  } finally {
    process.exit(1);
  }
});

