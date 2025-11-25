import { Event, Prisma } from '@prisma/client';
import { eventRepository } from '../repositories/event.repository';
import { NotFoundError, DatabaseError, ValidationError } from '../lib/errors';
import { logger } from '../lib/logger';
import { auditService } from '../lib/audit';
import { z } from 'zod';
import { prisma } from '../lib/prisma';

// Validation schemas
const createEventSchema = z.object({
  name: z.string().min(2).max(200),
  city: z.string().min(2).max(100),
  country: z.string().min(2).max(100),
  venue: z.string().min(2).max(200),
  startAt: z.coerce.date().refine((date) => date > new Date(), {
    message: 'Event start date must be in the future',
  }),
  endAt: z.coerce.date().optional(),
  description: z.string().max(5000).optional(),
  posterUrl: z.string().url().optional(),
  status: z.enum(['SCHEDULED', 'UPCOMING', 'LIVE', 'COMPLETED', 'CANCELLED']).default('SCHEDULED'),
  featured: z.boolean().default(false),
  streamUrl: z.string().url().optional(),
  ticketsUrl: z.string().url().optional(),
});

const updateEventSchema = createEventSchema.partial().extend({
  startAt: z.coerce.date().optional(),
});

export class EventService {
  static async getEvents(params: {
    page: number;
    limit: number;
    city?: string;
    country?: string;
    status?: string;
    from?: Date;
    to?: Date;
  }) {
    try {
      const result = await eventRepository.findWithFilters(params);
      return {
        data: result.events,
        pagination: {
          page: params.page,
          limit: params.limit,
          total: result.total,
          totalPages: Math.ceil(result.total / params.limit),
        },
      };
    } catch (error) {
      logger.error('Error fetching events:', error);
      throw new DatabaseError('Failed to fetch events');
    }
  }

  static async getUpcomingEvents(limit: number = 20) {
    try {
      const events = await eventRepository.getUpcoming(limit);
      return { data: events };
    } catch (error) {
      logger.error('Error fetching upcoming events:', error);
      throw new DatabaseError('Failed to fetch upcoming events');
    }
  }

  static async getFeaturedEvent() {
    try {
      const event = await eventRepository.getFeatured();
      if (!event) {
        throw new NotFoundError('No upcoming events found');
      }
      return { data: event };
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      logger.error('Error fetching featured event:', error);
      throw new DatabaseError('Failed to fetch featured event');
    }
  }

  static async getLiveEvents() {
    try {
      const events = await eventRepository.getLive();
      return { data: events };
    } catch (error) {
      logger.error('Error fetching live events:', error);
      throw new DatabaseError('Failed to fetch live events');
    }
  }

  static async getEventById(id: string) {
    try {
      const event = await eventRepository.findUnique({ id });
      if (!event || event.deletedAt) {
        throw new NotFoundError('Event not found', { eventId: id });
      }
      return { data: event };
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      logger.error('Error fetching event:', error);
      throw new DatabaseError('Failed to fetch event');
    }
  }

  static async getEventFights(id: string) {
    try {
      // Check if event exists first
      const event = await eventRepository.findUnique({ id });
      if (!event || event.deletedAt) {
        throw new NotFoundError('Event not found', { eventId: id });
      }

      const fights = await eventRepository.getEventFights(id);
      return { data: fights };
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      logger.error('Error fetching event fights:', error);
      throw new DatabaseError('Failed to fetch event fights');
    }
  }

  /**
   * Create a new event
   */
  static async createEvent(
    data: z.infer<typeof createEventSchema>,
    userId?: string,
    requestDetails?: { ipAddress?: string; userAgent?: string }
  ) {
    // Validate input
    const validationResult = createEventSchema.safeParse(data);
    if (!validationResult.success) {
      throw new ValidationError('Invalid event data', {
        errors: validationResult.error.flatten().fieldErrors,
      });
    }

    const validatedData = validationResult.data;

    // Validate endAt is after startAt if provided
    if (validatedData.endAt && validatedData.endAt <= validatedData.startAt) {
      throw new ValidationError('End date must be after start date');
    }

    try {
      const event = await eventRepository.create(validatedData);

      // Audit log
      await auditService.logDataChange('CREATE', 'Event', event.id, {
        userId,
        newValue: event as unknown as Record<string, unknown>,
        ipAddress: requestDetails?.ipAddress,
        userAgent: requestDetails?.userAgent,
      });

      logger.info('Event created', { eventId: event.id, name: event.name });
      return { data: event };
    } catch (error) {
      logger.error('Error creating event:', error);
      throw new DatabaseError('Failed to create event');
    }
  }

  /**
   * Update an existing event
   */
  static async updateEvent(
    id: string,
    data: z.infer<typeof updateEventSchema>,
    userId?: string,
    requestDetails?: { ipAddress?: string; userAgent?: string }
  ) {
    // Validate input
    const validationResult = updateEventSchema.safeParse(data);
    if (!validationResult.success) {
      throw new ValidationError('Invalid event data', {
        errors: validationResult.error.flatten().fieldErrors,
      });
    }

    const validatedData = validationResult.data;

    // Check if event exists
    const existingEvent = await eventRepository.findUnique({ id });
    if (!existingEvent || existingEvent.deletedAt) {
      throw new NotFoundError('Event not found', { eventId: id });
    }

    // Validate date constraints
    const startAt = validatedData.startAt ?? existingEvent.startAt;
    const endAt = validatedData.endAt ?? existingEvent.endAt;
    if (endAt && endAt <= startAt) {
      throw new ValidationError('End date must be after start date');
    }

    try {
      const updatedEvent = await eventRepository.update({ id }, validatedData);

      // Audit log
      await auditService.logDataChange('UPDATE', 'Event', id, {
        userId,
        oldValue: existingEvent as unknown as Record<string, unknown>,
        newValue: updatedEvent as unknown as Record<string, unknown>,
        ipAddress: requestDetails?.ipAddress,
        userAgent: requestDetails?.userAgent,
      });

      logger.info('Event updated', { eventId: id });
      return { data: updatedEvent };
    } catch (error) {
      logger.error('Error updating event:', error);
      throw new DatabaseError('Failed to update event');
    }
  }

  /**
   * Delete an event (soft delete)
   */
  static async deleteEvent(
    id: string,
    userId?: string,
    requestDetails?: { ipAddress?: string; userAgent?: string }
  ) {
    // Check if event exists
    const existingEvent = await eventRepository.findUnique({ id });
    if (!existingEvent || existingEvent.deletedAt) {
      throw new NotFoundError('Event not found', { eventId: id });
    }

    try {
      // Use transaction to soft-delete event and its fights
      await prisma.$transaction(async (tx) => {
        // Soft delete all fights for this event
        await tx.fight.updateMany({
          where: { eventId: id, deletedAt: null },
          data: { deletedAt: new Date() },
        });

        // Soft delete the event
        await tx.event.update({
          where: { id },
          data: { deletedAt: new Date() },
        });
      });

      // Audit log
      await auditService.logDataChange('DELETE', 'Event', id, {
        userId,
        oldValue: existingEvent as unknown as Record<string, unknown>,
        ipAddress: requestDetails?.ipAddress,
        userAgent: requestDetails?.userAgent,
      });

      logger.info('Event deleted', { eventId: id });
      return { success: true };
    } catch (error) {
      logger.error('Error deleting event:', error);
      throw new DatabaseError('Failed to delete event');
    }
  }

  /**
   * Update event status
   */
  static async updateEventStatus(
    id: string,
    status: 'SCHEDULED' | 'UPCOMING' | 'LIVE' | 'COMPLETED' | 'CANCELLED',
    userId?: string,
    requestDetails?: { ipAddress?: string; userAgent?: string }
  ) {
    const existingEvent = await eventRepository.findUnique({ id });
    if (!existingEvent || existingEvent.deletedAt) {
      throw new NotFoundError('Event not found', { eventId: id });
    }

    // Validate status transitions
    const validTransitions: Record<string, string[]> = {
      SCHEDULED: ['UPCOMING', 'CANCELLED'],
      UPCOMING: ['LIVE', 'CANCELLED'],
      LIVE: ['COMPLETED', 'CANCELLED'],
      COMPLETED: [], // Cannot change from completed
      CANCELLED: [], // Cannot change from cancelled
    };

    const currentStatus = existingEvent.status;
    if (!validTransitions[currentStatus]?.includes(status)) {
      throw new ValidationError(
        `Invalid status transition from ${currentStatus} to ${status}`
      );
    }

    try {
      const updatedEvent = await eventRepository.update({ id }, { status });

      // Audit log
      await auditService.logDataChange('UPDATE', 'Event', id, {
        userId,
        oldValue: { status: currentStatus },
        newValue: { status },
        ipAddress: requestDetails?.ipAddress,
        userAgent: requestDetails?.userAgent,
      });

      logger.info('Event status updated', { eventId: id, oldStatus: currentStatus, newStatus: status });
      return { data: updatedEvent };
    } catch (error) {
      logger.error('Error updating event status:', error);
      throw new DatabaseError('Failed to update event status');
    }
  }

  /**
   * Set featured event (unsets other featured events)
   */
  static async setFeaturedEvent(
    id: string,
    userId?: string,
    requestDetails?: { ipAddress?: string; userAgent?: string }
  ) {
    const event = await eventRepository.findUnique({ id });
    if (!event || event.deletedAt) {
      throw new NotFoundError('Event not found', { eventId: id });
    }

    try {
      // Use transaction to unset other featured events and set new one
      const updatedEvent = await prisma.$transaction(async (tx) => {
        // Unset any currently featured events
        await tx.event.updateMany({
          where: { featured: true, id: { not: id } },
          data: { featured: false },
        });

        // Set the new featured event
        return tx.event.update({
          where: { id },
          data: { featured: true },
        });
      });

      // Audit log
      await auditService.logAdminAction(
        userId ?? 'system',
        `Set event "${event.name}" as featured`,
        {
          entityType: 'Event',
          entityId: id,
          ipAddress: requestDetails?.ipAddress,
          userAgent: requestDetails?.userAgent,
        }
      );

      logger.info('Featured event set', { eventId: id });
      return { data: updatedEvent };
    } catch (error) {
      logger.error('Error setting featured event:', error);
      throw new DatabaseError('Failed to set featured event');
    }
  }
}
