import { apiClient } from './api';

export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  venue: string;
  status: 'upcoming' | 'live' | 'completed';
  image?: string;
  description?: string;
  fights: Fight[];
  mainEvent: Fight;
  coMainEvent?: Fight;
  ticketPrice?: number;
  ticketUrl?: string;
  streamUrl?: string;
  isWatched: boolean;
}

export interface Fight {
  id: string;
  fighter1: {
    name: string;
    record: string;
    image?: string;
  };
  fighter2: {
    name: string;
    record: string;
    image?: string;
  };
  weightClass: string;
  rounds: number;
  isMainEvent: boolean;
  isCoMainEvent: boolean;
  result?: {
    winner: 'fighter1' | 'fighter2' | 'draw' | 'nc';
    method: string;
    round: number;
    time: string;
  };
}

export interface EventsResponse {
  data: Event[];
  total: number;
  page: number;
  limit: number;
}

export interface EventFilters {
  search?: string;
  status?: 'upcoming' | 'live' | 'completed' | 'all';
  location?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export const eventsApi = {
  // Get all events with filters
  getEvents: async (filters: EventFilters = {}): Promise<EventsResponse> => {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.status && filters.status !== 'all') params.append('status', filters.status);
    if (filters.location) params.append('location', filters.location);
    if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.append('dateTo', filters.dateTo);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const response = await apiClient.get(`/events?${params.toString()}`);
    return response.data;
  },

  // Get single event by ID
  getEvent: async (id: string): Promise<Event> => {
    const response = await apiClient.get(`/events/${id}`);
    return response.data.data;
  },

  // Watch an event
  watchEvent: async (id: string): Promise<void> => {
    await apiClient.post(`/events/${id}/watch`);
  },

  // Unwatch an event
  unwatchEvent: async (id: string): Promise<void> => {
    await apiClient.delete(`/events/${id}/watch`);
  },

  // Get watched events
  getWatchedEvents: async (): Promise<Event[]> => {
    const response = await apiClient.get('/events/watched');
    return response.data.data;
  },

  // Get upcoming events
  getUpcomingEvents: async (limit = 10): Promise<Event[]> => {
    const response = await apiClient.get(`/events/upcoming?limit=${limit}`);
    return response.data.data;
  },

  // Get live events
  getLiveEvents: async (): Promise<Event[]> => {
    const response = await apiClient.get('/events/live');
    return response.data.data;
  },

  // Get events by date range
  getEventsByDateRange: async (startDate: string, endDate: string): Promise<Event[]> => {
    const response = await apiClient.get(`/events/date-range?start=${startDate}&end=${endDate}`);
    return response.data.data;
  },

  // Get events by location
  getEventsByLocation: async (location: string): Promise<Event[]> => {
    const response = await apiClient.get(`/events/location/${encodeURIComponent(location)}`);
    return response.data.data;
  },

  // Search events
  searchEvents: async (query: string): Promise<Event[]> => {
    const response = await apiClient.get(`/events/search?q=${encodeURIComponent(query)}`);
    return response.data.data;
  },

  // Get event fights
  getEventFights: async (id: string): Promise<Fight[]> => {
    const response = await apiClient.get(`/events/${id}/fights`);
    return response.data.data;
  },

  // Get event results
  getEventResults: async (id: string) => {
    const response = await apiClient.get(`/events/${id}/results`);
    return response.data.data;
  },

  // Get event statistics
  getEventStats: async (id: string) => {
    const response = await apiClient.get(`/events/${id}/stats`);
    return response.data.data;
  },
};
