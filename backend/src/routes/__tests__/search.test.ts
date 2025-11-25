import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import { FastifyInstance } from 'fastify';
import { build } from '../../lib/test-helpers';

describe('Search API', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await build();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /api/search', () => {
    it('returns aggregated results across entities', async () => {
      const fighter = await global.testUtils.createTestFighter({ name: 'Belgrade Warrior', nickname: 'BG Hero' }) as { id: string };
      const event = await global.testUtils.createTestEvent({ name: 'Belgrade Fight Night', city: 'Belgrade' }) as { id: string };
      const news = await global.testUtils.createTestNews({
        title: 'Belgrade MMA Update',
        slug: `belgrade-update-${Date.now()}`,
        category: 'UPDATES',
      }) as { id: string };
      const club = await global.testUtils.createTestClub({ name: 'Belgrade Combat Club', city: 'Belgrade' }) as { id: string };

      const response = await app.inject({
        method: 'GET',
        url: '/api/search?q=Belgrade',
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data.length).toBeGreaterThanOrEqual(4);
      expect(body.data).toEqual(expect.arrayContaining([
        expect.objectContaining({ type: 'fighter', id: fighter.id }),
        expect.objectContaining({ type: 'event', id: event.id }),
        expect.objectContaining({ type: 'news', id: news.id }),
        expect.objectContaining({ type: 'club', id: club.id }),
      ]));
    });

    it('applies type filters', async () => {
      await global.testUtils.createTestFighter({ name: 'Filter Fighter' });
      const response = await app.inject({
        method: 'GET',
        url: '/api/search?q=Filter&type=fighter',
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.data.length).toBeGreaterThan(0);
      expect(body.data.every((item: { type: string }) => item.type === 'fighter')).toBe(true);
    });

    it('rejects short queries', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/search?q=a',
      });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('GET /api/search/suggestions', () => {
    it('returns names across entities', async () => {
      const news = await global.testUtils.createTestNews({
        title: 'Suggestion News Belgrade',
        slug: `suggestion-news-${Date.now()}`,
      }) as { id: string };

      const response = await app.inject({
        method: 'GET',
        url: '/api/search/suggestions?q=Belgrade',
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
      expect(body.data).toEqual(expect.arrayContaining([
        expect.objectContaining({ id: news.id, type: 'news' }),
      ]));
    });
  });
});
