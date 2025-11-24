import type { UserPayload } from '../lib/auth';

declare module 'fastify' {
  interface FastifyRequest {
    user?: UserPayload;
    validatedBody?: unknown;
    validatedQuery?: unknown;
    validatedParams?: unknown;
  }
}
