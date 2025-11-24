import { prisma, isUsingMockPrisma, resetMockPrisma } from '../lib/prisma';

// Setup before all tests
beforeAll(async () => {
  await prisma.$connect();
});

// Cleanup after all tests
afterAll(async () => {
  await prisma.$disconnect();
});

// Reset database before each test
beforeEach(async () => {
  if (isUsingMockPrisma()) {
    resetMockPrisma();
    return;
  }

  const tables = [
    'Prediction',
    'Fight',
    'Event',
    'FollowedFighter',
    'FollowedClub',
    'WatchlistItem',
    'Fighter',
    'Club',
    'News',
    'User',
  ];

  for (const table of tables) {
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${table}" CASCADE;`);
  }
});

// Global test utilities
global.testUtils = {
  // Create test user
  createTestUser: async (overrides = {}) => {
    return prisma.user.create({
      data: {
        email: 'test@example.com',
        username: 'testuser',
        password: '$2a$10$test', // Pre-hashed for testing
        role: 'USER',
        ...overrides,
      },
    });
  },

  // Create test fighter
  createTestFighter: async (overrides = {}) => {
    return prisma.fighter.create({
      data: {
        name: 'Test Fighter',
        country: 'Serbia',
        countryCode: 'RS',
        weightClass: 'LIGHTWEIGHT',
        wins: 10,
        losses: 2,
        draws: 0,
        ...overrides,
      },
    });
  },

  // Create test event
  createTestEvent: async (overrides = {}) => {
    return prisma.event.create({
      data: {
        name: 'Test Event',
        startAt: new Date(),
        status: 'SCHEDULED',
        city: 'Belgrade',
        country: 'Serbia',
        ...overrides,
      },
    });
  },
};

// Type augmentation for global test utilities
declare global {
  // eslint-disable-next-line no-var
  var testUtils: {
    createTestUser: (overrides?: Record<string, unknown>) => Promise<unknown>;
    createTestFighter: (overrides?: Record<string, unknown>) => Promise<unknown>;
    createTestEvent: (overrides?: Record<string, unknown>) => Promise<unknown>;
  };
}

