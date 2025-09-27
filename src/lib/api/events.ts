import { apiClient, API_CONFIG, buildQueryParams, type ApiResponse } from "./client";

export type Event = {
  id: string;
  name: string;
  startAt: string; // ISO
  status: "SCHEDULED" | "LIVE" | "COMPLETED" | "CANCELLED";
  city: string;
  country: string;
  mainEvent?: string;
  ticketsAvailable: boolean;
  fightsCount: number;
  attendees?: number;
};

export async function getEvents(params: Record<string, unknown>) {
  const qs = buildQueryParams(params as any);
  return apiClient.get<Event[]>(`${API_CONFIG.ENDPOINTS.EVENTS}${qs}`);
}

export const getUpcomingEvents = () => apiClient.get<Event[]>(API_CONFIG.ENDPOINTS.UPCOMING_EVENTS);
export const getLiveEvents = () => apiClient.get<Event[]>(API_CONFIG.ENDPOINTS.LIVE_EVENTS);
