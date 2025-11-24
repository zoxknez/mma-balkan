import { build } from '../../lib/test-helpers';
import { FastifyInstance } from 'fastify';

describe('Fighters API', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await build();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /api/fighters', () => {
    it('should return list of fighters', async () => {
      await global.testUtils.createTestFighter({ name: 'Fighter 1' });
      await global.testUtils.createTestFighter({ name: 'Fighter 2' });

      const response = await app.inject({
        method: 'GET',
        url: '/api/fighters',
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data).toHaveLength(2);
    });

    it('should filter by weightClass', async () => {
      await global.testUtils.createTestFighter({ weightClass: 'LIGHTWEIGHT' });
      await global.testUtils.createTestFighter({ weightClass: 'HEAVYWEIGHT' });

      const response = await app.inject({
        method: 'GET',
        url: '/api/fighters?weightClass=LIGHTWEIGHT',
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.data).toHaveLength(1);
      expect(body.data[0].weightClass).toBe('LIGHTWEIGHT');
    });

    it('should paginate results', async () => {
      // Create 25 fighters
      for (let i = 0; i < 25; i++) {
        await global.testUtils.createTestFighter({ name: `Fighter ${i}` });
      }

      const response = await app.inject({
        method: 'GET',
        url: '/api/fighters?page=2&limit=10',
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.data).toHaveLength(10);
      expect(body.pagination.page).toBe(2);
      expect(body.pagination.totalPages).toBe(3);
    });
  });

  describe('GET /api/fighters/:id', () => {
    it('should return fighter by id', async () => {
      const fighter = await global.testUtils.createTestFighter() as { id: string };

      const response = await app.inject({
        method: 'GET',
        url: `/api/fighters/${fighter.id}`,
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data.id).toBe(fighter.id);
    });

    it('should return 404 for non-existent fighter', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/fighters/c000000000000000000000000',
      });

      expect(response.statusCode).toBe(404);
    });
  });

  describe('GET /api/fighters/trending', () => {
    it('should return trending fighters', async () => {
      await global.testUtils.createTestFighter({ wins: 15 });
      await global.testUtils.createTestFighter({ wins: 10 });
      await global.testUtils.createTestFighter({ wins: 20 });

      const response = await app.inject({
        method: 'GET',
        url: '/api/fighters/trending?limit=3',
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.data).toHaveLength(3);
      expect(body.data[0].wins).toBe(20); // Highest wins first
    });
  });

  describe('POST /api/fighters', () => {
    it('should require authentication', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/fighters',
        payload: {
          name: 'New Fighter',
          country: 'Serbia',
          countryCode: 'RS',
          weightClass: 'LIGHTWEIGHT',
        },
      });

      expect(response.statusCode).toBe(401);
    });

    // TODO: Add authenticated tests when auth test helpers are ready
  });
});

