import { Fighter, Prisma, WeightClass, FightStatus } from '@prisma/client';
import { prisma } from '../lib/prisma';

export type FighterWithFights = Prisma.FighterGetPayload<{
  include: {
    redFights: {
      include: {
        event: true;
        blueFighter: true;
      };
      orderBy: { createdAt: 'desc' };
    };
    blueFights: {
      include: {
        event: true;
        redFighter: true;
      };
      orderBy: { createdAt: 'desc' };
    };
  };
}>;

export class FighterRepository {
  // Basic CRUD operations
  
  async findUnique(where: Prisma.FighterWhereUniqueInput): Promise<Fighter | null> {
    return prisma.fighter.findUnique({ where });
  }

  async create(data: Prisma.FighterCreateInput): Promise<Fighter> {
    return prisma.fighter.create({ data });
  }

  async update(where: Prisma.FighterWhereUniqueInput, data: Prisma.FighterUpdateInput): Promise<Fighter> {
    return prisma.fighter.update({ where, data });
  }

  async softDelete(where: Prisma.FighterWhereUniqueInput): Promise<Fighter> {
    return prisma.fighter.update({
      where,
      data: { deletedAt: new Date() },
    });
  }

  // Find fighters with filters and pagination
  async findWithFilters(params: {
    page: number;
    limit: number;
    search?: string;
    country?: string;
    weightClass?: WeightClass;
    isActive?: boolean;
  }): Promise<{ fighters: Fighter[]; total: number }> {
    const { page, limit, search, country, weightClass, isActive } = params;
    
    const where: Prisma.FighterWhereInput = {
      deletedAt: null, // Exclude soft-deleted
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { nickname: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (country) {
      where.country = { contains: country, mode: 'insensitive' };
    }

    if (weightClass) {
      where.weightClass = weightClass;
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const [fighters, total] = await Promise.all([
      prisma.fighter.findMany({
        where,
        orderBy: [{ wins: 'desc' }, { name: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.fighter.count({ where }),
    ]);

    return { fighters, total };
  }

  // Get trending fighters
  async getTrending(limit: number): Promise<Fighter[]> {
    return prisma.fighter.findMany({
      where: {
        isActive: true,
        deletedAt: null,
      },
      orderBy: [
        { wins: 'desc' },
        { updatedAt: 'desc' },
      ],
      take: limit,
    });
  }

  // Get fighter with fight history
  async findWithFights(id: string): Promise<FighterWithFights | null> {
    return prisma.fighter.findUnique({
      where: { id },
      include: {
        redFights: {
          include: {
            event: true,
            blueFighter: true,
          },
          orderBy: { createdAt: 'desc' },
        },
        blueFights: {
          include: {
            event: true,
            redFighter: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  // Get fighter's upcoming fights
  async getUpcomingFights(id: string) {
    return prisma.fight.findMany({
      where: {
        OR: [
          { redFighterId: id },
          { blueFighterId: id },
        ],
        status: { in: [FightStatus.SCHEDULED] },
        deletedAt: null,
      },
      include: {
        event: true,
        redFighter: true,
        blueFighter: true,
      },
      orderBy: { orderNo: 'asc' },
    });
  }

  // Get fighter's completed fights
  async getCompletedFights(id: string) {
    return prisma.fight.findMany({
      where: {
        OR: [
          { redFighterId: id },
          { blueFighterId: id },
        ],
        status: FightStatus.COMPLETED,
        deletedAt: null,
      },
      include: {
        event: true,
        redFighter: true,
        blueFighter: true,
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  // Update fighter stats (atomic)
  async updateStats(id: string, stats: {
    wins?: number;
    losses?: number;
    draws?: number;
    koTkoWins?: number;
    submissionWins?: number;
    decisionWins?: number;
  }): Promise<Fighter> {
    return prisma.fighter.update({
      where: { id },
      data: stats,
    });
  }
}

export const fighterRepository = new FighterRepository();

