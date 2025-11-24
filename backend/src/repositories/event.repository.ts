import { Event, Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';

export class EventRepository {
  async findUnique(where: Prisma.EventWhereUniqueInput): Promise<Event | null> {
    return prisma.event.findUnique({ where });
  }

  async create(data: Prisma.EventCreateInput): Promise<Event> {
    return prisma.event.create({ data });
  }

  async update(where: Prisma.EventWhereUniqueInput, data: Prisma.EventUpdateInput): Promise<Event> {
    return prisma.event.update({ where, data });
  }

  async softDelete(where: Prisma.EventWhereUniqueInput): Promise<Event> {
    return prisma.event.update({
      where,
      data: { deletedAt: new Date() },
    });
  }

  async findWithFilters(params: {
    page: number;
    limit: number;
    city?: string;
    country?: string;
    status?: string;
    from?: Date;
    to?: Date;
  }): Promise<{ events: Event[]; total: number }> {
    const { page, limit, city, country, status, from, to } = params;
    
    const where: Prisma.EventWhereInput = {
      deletedAt: null,
    };

    if (city) where.city = { contains: city, mode: 'insensitive' };
    if (country) where.country = { contains: country, mode: 'insensitive' };
    if (status) where.status = status as any; // Cast to enum if needed, or let Prisma handle it
    if (from || to) {
      where.startAt = {};
      if (from) where.startAt.gte = from;
      if (to) where.startAt.lte = to;
    }

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        orderBy: [{ startAt: 'desc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.event.count({ where }),
    ]);

    return { events, total };
  }

  async getUpcoming(limit: number = 20): Promise<Event[]> {
    const now = new Date();
    return prisma.event.findMany({
      where: {
        startAt: { gt: now },
        status: { in: ['SCHEDULED', 'UPCOMING'] },
        deletedAt: null,
      },
      orderBy: [{ startAt: 'asc' }],
      take: limit,
    });
  }

  async getFeatured(): Promise<Event | null> {
    const now = new Date();
    // Try to find explicitly featured event
    const event = await prisma.event.findFirst({
      where: {
        startAt: { gt: now },
        featured: true,
        status: { in: ['SCHEDULED', 'UPCOMING'] },
        deletedAt: null,
      },
      orderBy: [{ startAt: 'asc' }],
      include: {
        fights: {
          orderBy: { orderNo: 'asc' },
          include: {
            redFighter: true,
            blueFighter: true,
          },
        },
      },
    });

    if (event) return event;

    // Fallback to next upcoming event
    return prisma.event.findFirst({
      where: {
        startAt: { gt: now },
        status: { in: ['SCHEDULED', 'UPCOMING'] },
        deletedAt: null,
      },
      orderBy: [{ startAt: 'asc' }],
      include: {
        fights: {
          orderBy: { orderNo: 'asc' },
          include: {
            redFighter: true,
            blueFighter: true,
          },
        },
      },
    });
  }

  async getLive(): Promise<Event[]> {
    return prisma.event.findMany({
      where: {
        status: 'LIVE',
        deletedAt: null,
      },
      orderBy: [{ startAt: 'desc' }],
      take: 20,
    });
  }

  async getEventFights(eventId: string) {
    return prisma.fight.findMany({
      where: {
        eventId,
        deletedAt: null,
      },
      orderBy: [{ orderNo: 'asc' }],
      include: {
        redFighter: true,
        blueFighter: true,
      },
    });
  }
}

export const eventRepository = new EventRepository();
