/**
 * Audit Logging Service
 * Tracks all important actions in the system for security and compliance
 */

import { prisma } from './prisma';
import { logger } from './logger';
import { Prisma } from '@prisma/client';

export type AuditAction =
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'LOGIN'
  | 'LOGOUT'
  | 'LOGIN_FAILED'
  | 'PASSWORD_CHANGE'
  | 'PASSWORD_RESET'
  | 'EMAIL_VERIFY'
  | 'ROLE_CHANGE'
  | 'ACCOUNT_LOCK'
  | 'ACCOUNT_UNLOCK'
  | 'EXPORT_DATA'
  | 'IMPORT_DATA'
  | 'ADMIN_ACTION';

export type EntityType =
  | 'User'
  | 'Fighter'
  | 'Event'
  | 'Fight'
  | 'Club'
  | 'News'
  | 'Prediction'
  | 'Session'
  | 'System';

// Type for internal log method input
interface AuditLogInput {
  userId: string | null;
  action: AuditAction;
  entityType: EntityType;
  entityId: string | null;
  oldValue: Prisma.InputJsonValue | null;
  newValue: Prisma.InputJsonValue | null;
  ipAddress: string | null;
  userAgent: string | null;
}

class AuditService {
  /**
   * Log an audit event
   */
  private async log(data: AuditLogInput): Promise<void> {
    try {
      // Build create data dynamically to handle null values properly
      const createData: Prisma.AuditLogUncheckedCreateInput = {
        action: data.action,
        entityType: data.entityType,
      };

      if (data.userId !== null) {
        createData.userId = data.userId;
      }
      if (data.entityId !== null) {
        createData.entityId = data.entityId;
      }
      if (data.oldValue !== null) {
        createData.oldValue = data.oldValue;
      }
      if (data.newValue !== null) {
        createData.newValue = data.newValue;
      }
      if (data.ipAddress !== null) {
        createData.ipAddress = data.ipAddress;
      }
      if (data.userAgent !== null) {
        createData.userAgent = data.userAgent;
      }

      await prisma.auditLog.create({ data: createData });

      // Also log to application logger for immediate visibility
      logger.info(`Audit: ${data.action} on ${data.entityType}`, {
        userId: data.userId,
        entityId: data.entityId,
      });
    } catch (error) {
      // Don't throw - audit logging should never break the application
      logger.error('Failed to create audit log', error);
    }
  }

  /**
   * Log a user action
   */
  async logUserAction(
    userId: string,
    action: AuditAction,
    details: {
      entityType?: EntityType;
      entityId?: string;
      oldValue?: Record<string, unknown>;
      newValue?: Record<string, unknown>;
      ipAddress?: string;
      userAgent?: string;
    } = {}
  ): Promise<void> {
    await this.log({
      userId,
      action,
      entityType: details.entityType ?? 'User',
      entityId: details.entityId ?? userId,
      oldValue: (details.oldValue as Prisma.InputJsonValue) ?? null,
      newValue: (details.newValue as Prisma.InputJsonValue) ?? null,
      ipAddress: details.ipAddress ?? null,
      userAgent: details.userAgent ?? null,
    });
  }

  /**
   * Log a login attempt
   */
  async logLogin(
    userId: string | null,
    success: boolean,
    details: {
      email?: string;
      ipAddress?: string;
      userAgent?: string;
      failureReason?: string;
    } = {}
  ): Promise<void> {
    const newValue = success
      ? { timestamp: new Date().toISOString() }
      : { email: details.email ?? null, reason: details.failureReason ?? null };

    await this.log({
      userId: success ? userId : null,
      action: success ? 'LOGIN' : 'LOGIN_FAILED',
      entityType: 'Session',
      entityId: userId,
      oldValue: null,
      newValue: newValue as Prisma.InputJsonValue,
      ipAddress: details.ipAddress ?? null,
      userAgent: details.userAgent ?? null,
    });
  }

  /**
   * Log a logout
   */
  async logLogout(
    userId: string,
    details: {
      ipAddress?: string;
      userAgent?: string;
    } = {}
  ): Promise<void> {
    await this.log({
      userId,
      action: 'LOGOUT',
      entityType: 'Session',
      entityId: userId,
      oldValue: null,
      newValue: null,
      ipAddress: details.ipAddress ?? null,
      userAgent: details.userAgent ?? null,
    });
  }

  /**
   * Log a data change (create, update, delete)
   */
  async logDataChange<T extends Record<string, unknown>>(
    action: 'CREATE' | 'UPDATE' | 'DELETE',
    entityType: EntityType,
    entityId: string,
    details: {
      userId?: string;
      oldValue?: T;
      newValue?: T;
      ipAddress?: string;
      userAgent?: string;
    } = {}
  ): Promise<void> {
    // For sensitive fields, mask them before logging
    const maskedOld = details.oldValue ? this.maskSensitiveFields(details.oldValue) : null;
    const maskedNew = details.newValue ? this.maskSensitiveFields(details.newValue) : null;

    await this.log({
      userId: details.userId ?? null,
      action,
      entityType,
      entityId,
      oldValue: maskedOld as Prisma.InputJsonValue | null,
      newValue: maskedNew as Prisma.InputJsonValue | null,
      ipAddress: details.ipAddress ?? null,
      userAgent: details.userAgent ?? null,
    });
  }

  /**
   * Log an admin action
   */
  async logAdminAction(
    adminUserId: string,
    description: string,
    details: {
      targetUserId?: string;
      entityType?: EntityType;
      entityId?: string;
      metadata?: Record<string, unknown>;
      ipAddress?: string;
      userAgent?: string;
    } = {}
  ): Promise<void> {
    await this.log({
      userId: adminUserId,
      action: 'ADMIN_ACTION',
      entityType: details.entityType ?? 'System',
      entityId: details.entityId ?? null,
      oldValue: null,
      newValue: {
        description,
        targetUserId: details.targetUserId ?? null,
        ...details.metadata,
      } as Prisma.InputJsonValue,
      ipAddress: details.ipAddress ?? null,
      userAgent: details.userAgent ?? null,
    });
  }

  /**
   * Get audit logs for an entity
   */
  async getEntityLogs(
    entityType: EntityType,
    entityId: string,
    options: {
      limit?: number;
      offset?: number;
    } = {}
  ) {
    const { limit = 50, offset = 0 } = options;

    return prisma.auditLog.findMany({
      where: {
        entityType,
        entityId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });
  }

  /**
   * Get audit logs for a user
   */
  async getUserLogs(
    userId: string,
    options: {
      limit?: number;
      offset?: number;
      actions?: AuditAction[];
    } = {}
  ) {
    const { limit = 50, offset = 0, actions } = options;

    return prisma.auditLog.findMany({
      where: {
        userId,
        ...(actions && actions.length > 0 ? { action: { in: actions } } : {}),
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    });
  }

  /**
   * Get security-related logs (login attempts, password changes, etc.)
   */
  async getSecurityLogs(
    options: {
      limit?: number;
      offset?: number;
      from?: Date;
      to?: Date;
    } = {}
  ) {
    const { limit = 100, offset = 0, from, to } = options;

    const securityActions: AuditAction[] = [
      'LOGIN',
      'LOGOUT',
      'LOGIN_FAILED',
      'PASSWORD_CHANGE',
      'PASSWORD_RESET',
      'ACCOUNT_LOCK',
      'ACCOUNT_UNLOCK',
      'ROLE_CHANGE',
    ];

    return prisma.auditLog.findMany({
      where: {
        action: { in: securityActions },
        ...(from || to
          ? {
              createdAt: {
                ...(from ? { gte: from } : {}),
                ...(to ? { lte: to } : {}),
              },
            }
          : {}),
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });
  }

  /**
   * Clean up old audit logs (for GDPR compliance, etc.)
   */
  async cleanupOldLogs(retentionDays: number = 365): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    const result = await prisma.auditLog.deleteMany({
      where: {
        createdAt: {
          lt: cutoffDate,
        },
      },
    });

    logger.info(`Cleaned up ${result.count} audit logs older than ${retentionDays} days`);
    return result.count;
  }

  /**
   * Mask sensitive fields before logging
   */
  private maskSensitiveFields<T extends Record<string, unknown>>(data: T): T {
    const sensitiveFields = [
      'password',
      'passwordHash',
      'refreshToken',
      'accessToken',
      'token',
      'secret',
      'apiKey',
      'creditCard',
      'ssn',
    ];

    const masked = { ...data };

    for (const field of sensitiveFields) {
      if (field in masked) {
        (masked as Record<string, unknown>)[field] = '[REDACTED]';
      }
    }

    return masked;
  }
}

export const auditService = new AuditService();
