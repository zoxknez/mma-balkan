import { FighterService } from '../fighter.service';
import { prisma } from '../../lib/prisma';
import { NotFoundError, ValidationError } from '../../lib/errors';

describe('FighterService', () => {
  describe('getFighters', () => {
    it('should return paginated fighters', async () => {
      // Create test data
      await global.testUtils.createTestFighter({ name: 'Fighter 1' });
      await global.testUtils.createTestFighter({ name: 'Fighter 2' });

      const result = await FighterService.getFighters({
        page: 1,
        limit: 10,
      });

      expect(result.data).toHaveLength(2);
      expect(result.pagination).toEqual({
        page: 1,
        limit: 10,
        total: 2,
        totalPages: 1,
      });
    });

    it('should filter by country', async () => {
      await global.testUtils.createTestFighter({ country: 'Serbia' });
      await global.testUtils.createTestFighter({ country: 'Croatia' });

      const result = await FighterService.getFighters({
        page: 1,
        limit: 10,
        country: 'Serbia',
      });

      expect(result.data).toHaveLength(1);
      expect(result.data[0].country).toBe('Serbia');
    });

    it('should search by name', async () => {
      await global.testUtils.createTestFighter({ name: 'John Doe' });
      await global.testUtils.createTestFighter({ name: 'Jane Smith' });

      const result = await FighterService.getFighters({
        page: 1,
        limit: 10,
        search: 'John',
      });

      expect(result.data).toHaveLength(1);
      expect(result.data[0].name).toBe('John Doe');
    });
  });

  describe('getFighterById', () => {
    it('should return fighter by id', async () => {
      const created = await global.testUtils.createTestFighter() as { id: string };

      const result = await FighterService.getFighterById(created.id);

      expect(result.data).toBeDefined();
      expect(result.data.id).toBe(created.id);
    });

    it('should throw NotFoundError for non-existent fighter', async () => {
      await expect(
        FighterService.getFighterById('non-existent-id')
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('createFighter', () => {
    it('should create a new fighter', async () => {
      const fighterData = {
        name: 'New Fighter',
        country: 'Serbia',
        countryCode: 'RS',
        weightClass: 'LIGHTWEIGHT',
        wins: 5,
        losses: 1,
        draws: 0,
      };

      const result = await FighterService.createFighter(fighterData);

      expect(result.data).toBeDefined();
      expect(result.data.name).toBe('New Fighter');
      expect(result.data.wins).toBe(5);
    });

    it('should throw ValidationError for negative wins', async () => {
      const fighterData = {
        name: 'Invalid Fighter',
        country: 'Serbia',
        countryCode: 'RS',
        weightClass: 'LIGHTWEIGHT',
        wins: -1,
        losses: 0,
        draws: 0,
      };

      await expect(
        FighterService.createFighter(fighterData)
      ).rejects.toThrow(ValidationError);
    });

    it('should throw ValidationError for invalid height', async () => {
      const fighterData = {
        name: 'Tall Fighter',
        country: 'Serbia',
        countryCode: 'RS',
        weightClass: 'HEAVYWEIGHT',
        wins: 0,
        losses: 0,
        draws: 0,
        heightCm: 300, // Too tall
      };

      await expect(
        FighterService.createFighter(fighterData)
      ).rejects.toThrow(ValidationError);
    });
  });

  describe('updateFighter', () => {
    it('should update fighter data', async () => {
      const created = await global.testUtils.createTestFighter() as { id: string };

      const result = await FighterService.updateFighter(created.id, {
        wins: 15,
      });

      expect(result.data.wins).toBe(15);
    });

    it('should throw NotFoundError for non-existent fighter', async () => {
      await expect(
        FighterService.updateFighter('non-existent-id', { wins: 10 })
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('deleteFighter', () => {
    it('should soft delete fighter', async () => {
      const created = await global.testUtils.createTestFighter() as { id: string };

      await FighterService.deleteFighter(created.id);

      const fighter = await prisma.fighter.findUnique({
        where: { id: created.id },
      });

      expect(fighter?.deletedAt).toBeDefined();
    });

    it('should throw NotFoundError for non-existent fighter', async () => {
      await expect(
        FighterService.deleteFighter('non-existent-id')
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('getTrendingFighters', () => {
    it('should return fighters ordered by wins', async () => {
      await global.testUtils.createTestFighter({ wins: 5 });
      await global.testUtils.createTestFighter({ wins: 10 });
      await global.testUtils.createTestFighter({ wins: 8 });

      const result = await FighterService.getTrendingFighters(3);

      expect(result.data).toHaveLength(3);
      expect(result.data[0].wins).toBe(10);
      expect(result.data[1].wins).toBe(8);
      expect(result.data[2].wins).toBe(5);
    });

    it('should limit results', async () => {
      await global.testUtils.createTestFighter();
      await global.testUtils.createTestFighter();
      await global.testUtils.createTestFighter();

      const result = await FighterService.getTrendingFighters(2);

      expect(result.data).toHaveLength(2);
    });
  });
});

