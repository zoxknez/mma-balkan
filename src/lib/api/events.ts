import { apiClient, API_CONFIG, buildQueryParams } from "./client";

export type Event = {
  id: string;
  name: string;
  startAt: string; // ISO
  status: "SCHEDULED" | "UPCOMING" | "LIVE" | "COMPLETED" | "CANCELLED";
  city: string;
  country: string;
  mainEvent?: string;
  ticketsAvailable: boolean;
  fightsCount: number;
  attendees?: number;
};

export type EventQuery = Partial<{ page: number; limit: number; status: 'SCHEDULED' | 'UPCOMING' | 'LIVE' | 'COMPLETED' | 'CANCELLED' | undefined; city: string; country: string; from: string; to: string }>

export async function getEvents(params: EventQuery) {
  const qs = buildQueryParams(params);
  return apiClient.get<Event[]>(`${API_CONFIG.ENDPOINTS.EVENTS}${qs}`);
}

export const getUpcomingEvents = () => apiClient.get<Event[]>(API_CONFIG.ENDPOINTS.UPCOMING_EVENTS);
export const getLiveEvents = () => apiClient.get<Event[]>(API_CONFIG.ENDPOINTS.LIVE_EVENTS);
