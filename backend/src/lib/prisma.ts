import { PrismaClient, Prisma } from '@prisma/client';
import { env } from './env';
import { createMockPrismaClient } from './prisma-mock';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const useMockPrisma = env.NODE_ENV === 'test' && env.MOCK_PRISMA !== 'false';
const mockPrismaClient = useMockPrisma ? createMockPrismaClient() : null;

// Production-safe Prisma configuration
const getPrismaConfig = (): Prisma.PrismaClientOptions => {
  const isProduction = env.NODE_ENV === 'production';

  const logConfig: Prisma.LogDefinition[] = isProduction
    ? [
        { level: 'warn', emit: 'stdout' },
        { level: 'error', emit: 'stdout' },
      ]
    : [
        { level: 'query', emit: 'event' },
        { level: 'info', emit: 'stdout' },
        { level: 'warn', emit: 'stdout' },
        { level: 'error', emit: 'stdout' },
      ];

  return {
    log: logConfig,
    errorFormat: isProduction ? 'minimal' : 'pretty',
  };
};

export const prisma: PrismaClient = useMockPrisma
  ? (mockPrismaClient as unknown as PrismaClient)
  : (globalForPrisma.prisma ?? new PrismaClient(getPrismaConfig()));

// Query logging in development only when using real database
if (!useMockPrisma && env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;

  prisma.$on('query' as never, (e: { query: string; duration: number }) => {
    if (e.duration > 1000) {
      console.warn(`🐌 Slow query (${e.duration}ms):`, e.query);
    }
  });
}

// Graceful shutdown (no-op for mock)
if (!useMockPrisma) {
  const shutdown = async () => {
    await prisma.$disconnect();
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

export const isUsingMockPrisma = () => useMockPrisma;
export const resetMockPrisma = () => {
  mockPrismaClient?.$reset();
};
