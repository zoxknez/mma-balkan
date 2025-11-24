import { randomUUID } from 'crypto';
import type { Fighter, Fight, Event, User, Prisma } from '@prisma/client';

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value));

const createCuid = () => `c${randomUUID().replace(/-/g, '').slice(0, 24)}`;

const toComparable = (val: unknown) => (typeof val === 'string' ? val.toLowerCase() : val);

const extractScalar = <T>(value: any): T | undefined => {
  if (value === undefined) return undefined;
  if (value === null) return null as T;
  if (typeof value === 'object' && value !== null && 'set' in value) {
    return (value as { set: T }).set;
  }
  return value as T;
};

const containsMatch = (source: string | null | undefined, needle: string, mode?: Prisma.QueryMode) => {
  if (!source) return false;
  if (mode === 'insensitive') {
    return source.toLowerCase().includes(needle.toLowerCase());
  }
  return source.includes(needle);
};

export class MockPrismaClient {
  private fighters: Fighter[] = [];
  private fights: Fight[] = [];
  private events: Event[] = [];
  private users: User[] = [];

  fighter = {
    findUnique: async ({ where }: Prisma.FighterFindUniqueArgs) => {
      if (!where?.id) return null;
      const fighter = this.fighters.find((f) => f.id === where.id) ?? null;
      return fighter ? clone(fighter) : null;
    },
    findMany: async (args: Prisma.FighterFindManyArgs = {}) => {
      let data = this.filterFighters(args.where);
      data = this.sortFighters(data, args.orderBy);
      if (typeof args.skip === 'number') {
        data = data.slice(args.skip);
      }
      if (typeof args.take === 'number') {
        data = data.slice(0, args.take);
      }
      return data.map(clone);
    },
    count: async (args: Prisma.FighterCountArgs = {}) => {
      return this.filterFighters(args.where).length;
    },
    create: async ({ data }: Prisma.FighterCreateArgs) => {
      const now = new Date();
      const input = data as unknown as Partial<Fighter>;
      const fighter = {
        id: input.id ?? createCuid(),
        name: input.name ?? 'Test Fighter',
        nickname: input.nickname ?? null,
        country: input.country ?? 'Unknown',
        countryCode: input.countryCode ?? 'UN',
        birthDate: input.birthDate ?? null,
        heightCm: input.heightCm ?? null,
        weightKg: input.weightKg ?? null,
        weightClass: (input.weightClass ?? 'LIGHTWEIGHT') as Fighter['weightClass'],
        reachCm: input.reachCm ?? null,
        stance: input.stance ?? null,
        wins: input.wins ?? 0,
        losses: input.losses ?? 0,
        draws: input.draws ?? 0,
        koTkoWins: input.koTkoWins ?? 0,
        submissionWins: input.submissionWins ?? 0,
        decisionWins: input.decisionWins ?? 0,
        isActive: input.isActive ?? true,
        imageUrl: input.imageUrl ?? null,
        bio: input.bio ?? null,
        instagramHandle: input.instagramHandle ?? null,
        twitterHandle: input.twitterHandle ?? null,
        deletedAt: input.deletedAt ?? null,
        lastFight: input.lastFight ?? null,
        createdAt: input.createdAt ?? now,
        updatedAt: input.updatedAt ?? now,
      } as Fighter;

      this.fighters.push(fighter);
      return clone(fighter);
    },
    update: async ({ where, data }: Prisma.FighterUpdateArgs) => {
      if (!where.id) {
        throw new Error('Mock Prisma requires id for fighter.update');
      }
      const index = this.fighters.findIndex((f) => f.id === where.id);
      if (index === -1) {
        throw new Error('Fighter not found');
      }

      const current = this.fighters[index];
      const updates = data as Record<string, unknown>;
      const next = { ...current } as Fighter;

      Object.entries(updates).forEach(([key, value]) => {
        const scalar = extractScalar(value);
        if (scalar !== undefined) {
          (next as Record<string, unknown>)[key] = scalar;
        }
      });

      next.updatedAt = new Date();
      this.fighters[index] = next;
      return clone(next);
    },
  };

  fight = {
    findMany: async (args: Prisma.FightFindManyArgs = {}) => {
      let data = [...this.fights];

      if (args.where) {
        data = data.filter((fight) => {
          const redMatch = args.where?.OR?.some((cond) => cond?.redFighterId === fight.redFighterId) ?? false;
          const blueMatch = args.where?.OR?.some((cond) => cond?.blueFighterId === fight.blueFighterId) ?? false;
          const statusFilter = args.where?.status;
          let statusMatch = true;
          if (statusFilter) {
            if (typeof statusFilter === 'object' && 'in' in statusFilter) {
              const values = (statusFilter.in ?? []) as string[];
              statusMatch = values.length === 0 || values.includes(fight.status);
            } else if (typeof statusFilter === 'string') {
              statusMatch = fight.status === statusFilter;
            }
          }
          const notDeleted = args.where?.deletedAt === null ? fight.deletedAt === null : true;
          return (redMatch || blueMatch) && statusMatch && notDeleted;
        });
      }

      const orderBys = Array.isArray(args.orderBy) ? args.orderBy : args.orderBy ? [args.orderBy] : [];
      orderBys.forEach((order) => {
        if (order?.orderNo) {
          const direction = order.orderNo === 'desc' ? -1 : 1;
          data.sort((a, b) => ((a.orderNo ?? 0) - (b.orderNo ?? 0)) * direction);
        }
      });

      return data.map(clone);
    },
  };

  event = {
    create: async ({ data }: Prisma.EventCreateArgs) => {
      const now = new Date();
      const input = data as unknown as Partial<Event>;
      const event = {
        id: input.id ?? createCuid(),
        name: input.name ?? 'Test Event',
        startAt: input.startAt ?? now,
        status: (input.status ?? 'SCHEDULED') as Event['status'],
        city: input.city ?? 'City',
        country: input.country ?? 'Country',
        venue: input.venue ?? null,
        mainEvent: input.mainEvent ?? null,
        posterUrl: input.posterUrl ?? null,
        streamUrl: input.streamUrl ?? null,
        ticketsAvailable: input.ticketsAvailable ?? false,
        ticketUrl: input.ticketUrl ?? null,
        featured: input.featured ?? false,
        fightsCount: input.fightsCount ?? 0,
        attendees: input.attendees ?? null,
        deletedAt: input.deletedAt ?? null,
        createdAt: input.createdAt ?? now,
        updatedAt: input.updatedAt ?? now,
      } as Event;
      this.events.push(event);
      return clone(event);
    },
  };

  user = {
    create: async ({ data }: Prisma.UserCreateArgs) => {
      const now = new Date();
      const input = data as unknown as Partial<User>;
      const user = {
        id: input.id ?? createCuid(),
        email: input.email ?? `user-${randomUUID()}@example.com`,
        username: input.username ?? `user-${randomUUID()}`,
        password: input.password ?? 'password',
        firstName: input.firstName ?? null,
        lastName: input.lastName ?? null,
        role: (input.role ?? 'USER') as User['role'],
        isActive: input.isActive ?? true,
        emailVerified: input.emailVerified ?? false,
        emailVerificationToken: input.emailVerificationToken ?? null,
        passwordResetToken: input.passwordResetToken ?? null,
        passwordResetExpires: input.passwordResetExpires ?? null,
        lastPasswordChange: input.lastPasswordChange ?? null,
        deletedAt: input.deletedAt ?? null,
        lastLogin: input.lastLogin ?? null,
        createdAt: input.createdAt ?? now,
        updatedAt: input.updatedAt ?? now,
      } as User;
      this.users.push(user);
      return clone(user);
    },
  };

  $connect = async () => {};
  $disconnect = async () => {};
  $on = () => {};
  $executeRawUnsafe = async () => {};

  $reset() {
    this.fighters = [];
    this.fights = [];
    this.events = [];
    this.users = [];
  }

  private filterFighters(where?: Prisma.FighterWhereInput): Fighter[] {
    if (!where) {
      return [...this.fighters];
    }

    return this.fighters.filter((fighter) => {
      if (where.deletedAt === null && fighter.deletedAt !== null) {
        return false;
      }

      if (where.weightClass && fighter.weightClass !== where.weightClass) {
        return false;
      }

      if (typeof where.isActive === 'boolean' && fighter.isActive !== where.isActive) {
        return false;
      }

      if (where.country && typeof where.country === 'object' && 'contains' in where.country) {
        const needle = (where.country.contains ?? '') as string;
        if (!containsMatch(fighter.country, needle, where.country.mode)) {
          return false;
        }
      }

      if (where.OR && where.OR.length > 0) {
        const matches = where.OR.some((condition) => {
          if (condition?.name && typeof condition.name === 'object' && 'contains' in condition.name) {
            const needle = (condition.name.contains ?? '') as string;
            return containsMatch(fighter.name, needle, condition.name.mode);
          }
          if (condition?.nickname && typeof condition.nickname === 'object' && 'contains' in condition.nickname) {
            const needle = (condition.nickname.contains ?? '') as string;
            return containsMatch(fighter.nickname, needle, condition.nickname.mode);
          }
          return true;
        });
        if (!matches) {
          return false;
        }
      }

      return true;
    });
  }

  private sortFighters(
    fighters: Fighter[],
    orderBy?: Prisma.FighterOrderByWithRelationInput | Prisma.FighterOrderByWithRelationInput[]
  ): Fighter[] {
    if (!orderBy) {
      return [...fighters];
    }

    const orders = Array.isArray(orderBy) ? orderBy : [orderBy];

    const sorted = [...fighters];
    sorted.sort((a, b) => {
      for (const order of orders) {
        if (order.wins) {
          const direction = order.wins === 'desc' ? -1 : 1;
          if (a.wins !== b.wins) {
            return (a.wins - b.wins) * direction;
          }
        }
        if (order.name) {
          const direction = order.name === 'desc' ? -1 : 1;
          if (a.name !== b.name) {
            return a.name.localeCompare(b.name) * direction;
          }
        }
        if (order.updatedAt) {
          const direction = order.updatedAt === 'desc' ? -1 : 1;
          if (a.updatedAt.getTime() !== b.updatedAt.getTime()) {
            return (a.updatedAt.getTime() - b.updatedAt.getTime()) * direction;
          }
        }
      }
      return 0;
    });

    return sorted;
  }
}

export const createMockPrismaClient = () => new MockPrismaClient();