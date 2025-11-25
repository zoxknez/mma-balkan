import { Prisma, WeightClass } from '@prisma/client';
import { fighterRepository, FighterWithFights } from '../repositories/fighter.repository';
import { NotFoundError, ValidationError, DatabaseError } from '../lib/errors';
import { logger } from '../lib/logger';

export class FighterService {
  // Get all fighters with filters and pagination
  static async getFighters(params: {
    page: number;
    limit: number;
    search?: string;
    country?: string;
    weightClass?: WeightClass;
    isActive?: boolean;
  }) {
    try {
      const filters: Parameters<typeof fighterRepository.findWithFilters>[0] = {
        page: params.page,
        limit: params.limit,
        ...(params.search ? { search: params.search } : {}),
        ...(params.country ? { country: params.country } : {}),
        ...(typeof params.weightClass !== 'undefined' ? { weightClass: params.weightClass } : {}),
        ...(typeof params.isActive !== 'undefined' ? { isActive: params.isActive } : {}),
      };

      const result = await fighterRepository.findWithFilters(filters);
      
      return {
        data: result.fighters,
        pagination: {
          page: params.page,
          limit: params.limit,
          total: result.total,
          totalPages: Math.ceil(result.total / params.limit),
        },
      };
    } catch (error) {
      logger.error('Error fetching fighters:', error);
      throw new DatabaseError('Failed to fetch fighters');
    }
  }

  // Get trending fighters
  static async getTrendingFighters(limit: number = 10) {
    try {
      const fighters = await fighterRepository.getTrending(limit);
      return { data: fighters };
    } catch (error) {
      logger.error('Error fetching trending fighters:', error);
      throw new DatabaseError('Failed to fetch trending fighters');
    }
  }

  // Get fighter by ID
  static async getFighterById(id: string) {
    try {
      const fighter = await fighterRepository.findUnique({ id });
      
      if (!fighter) {
        throw new NotFoundError('Fighter not found', { fighterId: id });
      }

      return { data: fighter };
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      logger.error('Error fetching fighter:', error);
      throw new DatabaseError('Failed to fetch fighter');
    }
  }

  // Create fighter (admin only)
  static async createFighter(data: Prisma.FighterCreateInput) {
    try {
      // Validation business rules
      const wins = data.wins ?? 0;
      const losses = data.losses ?? 0;
      const draws = data.draws ?? 0;

      if (wins < 0 || losses < 0 || draws < 0) {
        throw new ValidationError('Record stats cannot be negative');
      }

      if (typeof data.heightCm === 'number' && (data.heightCm < 100 || data.heightCm > 250)) {
        throw new ValidationError('Height must be between 100cm and 250cm');
      }

      if (typeof data.weightKg === 'number' && (data.weightKg < 40 || data.weightKg > 200)) {
        throw new ValidationError('Weight must be between 40kg and 200kg');
      }

      const fighter = await fighterRepository.create(stripUndefinedValues(data));
      
      logger.info('Fighter created:', { fighterId: fighter.id, name: fighter.name });
      
      return { data: fighter };
    } catch (error) {
      if (error instanceof ValidationError) throw error;
      logger.error('Error creating fighter:', error);
      throw new DatabaseError('Failed to create fighter');
    }
  }

  // Update fighter (admin only)
  static async updateFighter(id: string, data: Prisma.FighterUpdateInput) {
    try {
      // Check if fighter exists
      const existing = await fighterRepository.findUnique({ id });
      if (!existing) {
        throw new NotFoundError('Fighter not found', { fighterId: id });
      }

      // Validate update data (same rules as create)
      if (typeof data.wins === 'number' && data.wins < 0) {
        throw new ValidationError('Wins cannot be negative');
      }
      if (typeof data.losses === 'number' && data.losses < 0) {
        throw new ValidationError('Losses cannot be negative');
      }
      if (typeof data.draws === 'number' && data.draws < 0) {
        throw new ValidationError('Draws cannot be negative');
      }

      if (typeof data.heightCm === 'number' && (data.heightCm < 100 || data.heightCm > 250)) {
        throw new ValidationError('Height must be between 100cm and 250cm');
      }

      if (typeof data.weightKg === 'number' && (data.weightKg < 40 || data.weightKg > 200)) {
        throw new ValidationError('Weight must be between 40kg and 200kg');
      }

      if (typeof data.reachCm === 'number' && (data.reachCm < 100 || data.reachCm > 250)) {
        throw new ValidationError('Reach must be between 100cm and 250cm');
      }

      const fighter = await fighterRepository.update({ id }, stripUndefinedValues(data));
      
      logger.info('Fighter updated:', { fighterId: fighter.id });
      
      return { data: fighter };
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof ValidationError) throw error;
      logger.error('Error updating fighter:', error);
      throw new DatabaseError('Failed to update fighter');
    }
  }

  // Delete fighter (soft delete)
  static async deleteFighter(id: string) {
    try {
      const existing = await fighterRepository.findUnique({ id });
      if (!existing) {
        throw new NotFoundError('Fighter not found', { fighterId: id });
      }

      await fighterRepository.softDelete({ id });
      
      logger.info('Fighter soft-deleted:', { fighterId: id });
      
      return { message: 'Fighter deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      logger.error('Error deleting fighter:', error);
      throw new DatabaseError('Failed to delete fighter');
    }
  }

  // Get fighter fights
  static async getFighterFights(id: string) {
    try {
      const fighter = await fighterRepository.findWithFights(id);
      
      if (!fighter) {
        throw new NotFoundError('Fighter not found', { fighterId: id });
      }

      // Combine red and blue fights
      const fights = combineFights(fighter);
      
      return { data: fights };
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      logger.error('Error fetching fighter fights:', error);
      throw new DatabaseError('Failed to fetch fighter fights');
    }
  }

  // Get fighter upcoming fights
  static async getFighterUpcomingFights(id: string) {
    try {
      const fighter = await fighterRepository.findUnique({ id });
      
      if (!fighter) {
        throw new NotFoundError('Fighter not found', { fighterId: id });
      }

      const fights = await fighterRepository.getUpcomingFights(id);
      
      return { data: fights };
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      logger.error('Error fetching upcoming fights:', error);
      throw new DatabaseError('Failed to fetch upcoming fights');
    }
  }
}

function combineFights(fighter: FighterWithFights) {
  const red = fighter.redFights ?? [];
  const blue = fighter.blueFights ?? [];
  return [...red, ...blue];
}

function stripUndefinedValues<T extends Record<string, unknown>>(obj: T): T {
  const entries = Object.entries(obj).filter(([, value]) => typeof value !== 'undefined');
  return Object.fromEntries(entries) as T;
}

