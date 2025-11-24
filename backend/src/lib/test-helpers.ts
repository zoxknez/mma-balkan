import Fastify, { FastifyInstance } from 'fastify';
import fastifyJwt from '@fastify/jwt';
import jwt from 'jsonwebtoken';
import { registerAuthRoutes } from '../routes/auth';
import { registerClubRoutes } from '../routes/clubs';
import { registerFighterRoutes } from '../routes/fighters';
import { registerEventRoutes } from '../routes/events';
import { registerNewsRoutes } from '../routes/news';
import { registerActivityRoutes } from '../routes/activity';
import { registerErrorHandler } from '../plugins/error-handler';
import { env } from './env';

// Build Fastify app for testing
export async function build(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: false, // Disable logging in tests
  });

  // Register JWT
  await app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
  });

  // Register routes
  await registerAuthRoutes(app);
  await registerClubRoutes(app);
  await registerFighterRoutes(app);
  await registerEventRoutes(app);
  await registerNewsRoutes(app);
  await registerActivityRoutes(app);
  await registerErrorHandler(app);

  return app;
}

// Generate test JWT token
export function generateTestToken(payload: {
  id: string;
  email: string;
  role: 'user' | 'admin' | 'moderator';
}): string {
  return jwt.sign({ ...payload, type: 'access' }, env.JWT_SECRET, {
    expiresIn: '1h',
  });
}

// Test data factories
export const TestFactory = {
  user: (overrides = {}) => ({
    email: 'test@example.com',
    username: 'testuser',
    password: 'testpassword123',
    firstName: 'Test',
    lastName: 'User',
    role: 'USER' as const,
    ...overrides,
  }),

  fighter: (overrides = {}) => ({
    name: 'Test Fighter',
    country: 'Serbia',
    countryCode: 'RS',
    weightClass: 'LIGHTWEIGHT',
    wins: 10,
    losses: 2,
    draws: 0,
    isActive: true,
    ...overrides,
  }),

  event: (overrides = {}) => ({
    name: 'Test Event',
    startAt: new Date(),
    status: 'SCHEDULED',
    city: 'Belgrade',
    country: 'Serbia',
    fightsCount: 0,
    ticketsAvailable: false,
    ...overrides,
  }),

  news: (overrides = {}) => ({
    title: 'Test News',
    slug: 'test-news',
    content: 'Test content',
    category: 'NEWS',
    authorName: 'Test Author',
    publishAt: new Date(),
    ...overrides,
  }),
};

