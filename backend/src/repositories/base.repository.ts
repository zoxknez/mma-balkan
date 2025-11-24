import { prisma } from '../lib/prisma';
import { Prisma } from '@prisma/client';

// Base repository with common operations
export abstract class BaseRepository<T, TCreateInput, TUpdateInput, TWhereUnique> {
  protected abstract model: keyof typeof prisma;

  private getDelegate() {
    return prisma[this.model as keyof typeof prisma] as Record<string, unknown>;
  }

  // Find all with pagination
  async findAll(params: {
    skip?: number;
    take?: number;
    where?: Partial<T>;
    orderBy?: unknown;
    include?: unknown;
  }): Promise<T[]> {
    const model = this.getDelegate() as {
      findMany: (args: unknown) => Promise<T[]>;
    };
    return model.findMany(params as never);
  }

  // Find one by unique identifier
  async findUnique(where: TWhereUnique, include?: unknown): Promise<T | null> {
    const model = this.getDelegate() as {
      findUnique: (args: { where: TWhereUnique; include?: unknown }) => Promise<T | null>;
    };
    return model.findUnique({ where, include });
  }

  // Find first matching record
  async findFirst(where: Partial<T>, include?: unknown): Promise<T | null> {
    const model = this.getDelegate() as {
      findFirst: (args: { where: Partial<T>; include?: unknown }) => Promise<T | null>;
    };
    return model.findFirst({ where, include });
  }

  // Count records
  async count(where?: Partial<T>): Promise<number> {
    const model = this.getDelegate() as {
      count: (args?: { where: Partial<T> }) => Promise<number>;
    };
    return model.count(where ? { where } : undefined);
  }

  // Create new record
  async create(data: TCreateInput): Promise<T> {
    const model = this.getDelegate() as {
      create: (args: { data: TCreateInput }) => Promise<T>;
    };
    return model.create({ data });
  }

  // Update existing record
  async update(where: TWhereUnique, data: TUpdateInput): Promise<T> {
    const model = this.getDelegate() as {
      update: (args: { where: TWhereUnique; data: unknown }) => Promise<T>;
    };
    return model.update({ where, data });
  }

  // Delete record (hard delete)
  async delete(where: TWhereUnique): Promise<T> {
    const model = this.getDelegate() as {
      delete: (args: { where: TWhereUnique }) => Promise<T>;
    };
    return model.delete({ where });
  }

  // Soft delete (if model has deletedAt field)
  async softDelete(where: TWhereUnique): Promise<T> {
    const model = this.getDelegate() as {
      update: (args: { where: TWhereUnique; data: unknown }) => Promise<T>;
    };
    return model.update({
      where,
      data: { deletedAt: new Date() },
    });
  }

  // Restore soft deleted record
  async restore(where: TWhereUnique): Promise<T> {
    const model = this.getDelegate() as {
      update: (args: { where: TWhereUnique; data: unknown }) => Promise<T>;
    };
    return model.update({
      where,
      data: { deletedAt: null },
    });
  }

  // Check if record exists
  async exists(where: Partial<T>): Promise<boolean> {
    const count = await this.count(where);
    return count > 0;
  }

  // Batch operations
  async createMany(data: TCreateInput[]): Promise<Prisma.BatchPayload> {
    const model = this.getDelegate() as {
      createMany: (args: { data: TCreateInput[] }) => Promise<Prisma.BatchPayload>;
    };
    return model.createMany({ data });
  }

  async updateMany(where: Partial<T>, data: Partial<TUpdateInput>): Promise<Prisma.BatchPayload> {
    const model = this.getDelegate() as {
      updateMany: (args: { where: Partial<T>; data: Partial<TUpdateInput> }) => Promise<Prisma.BatchPayload>;
    };
    return model.updateMany({ where, data });
  }

  async deleteMany(where: Partial<T>): Promise<Prisma.BatchPayload> {
    const model = this.getDelegate() as {
      deleteMany: (args: { where: Partial<T> }) => Promise<Prisma.BatchPayload>;
    };
    return model.deleteMany({ where });
  }
}

