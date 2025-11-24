import { Event, Prisma } from '@prisma/client';
import { eventRepository } from '../repositories/event.repository';
import { NotFoundError, DatabaseError } from '../lib/errors';
import { logger } from '../lib/logger';

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
}
