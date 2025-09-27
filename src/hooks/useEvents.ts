"use client";
import useSWR from "swr";
import { apiClient, API_CONFIG, buildQueryParams } from "@/lib/api/client";

export type Event = {
  id: string;
  name: string;
  startAt: string;
  status: "SCHEDULED" | "LIVE" | "COMPLETED" | "CANCELLED";
  city: string;
  country: string;
  mainEvent?: string;
  ticketsAvailable: boolean;
  fightsCount: number;
  attendees?: number;
};

export function useEvents(params: Record<string, unknown>) {
  const key = ["events", params];
  const fetcher = async () => {
    const qs = buildQueryParams(params as any);
    return apiClient.get<Event[]>(`${API_CONFIG.ENDPOINTS.EVENTS}${qs}`);
  };
  const { data, error, isLoading, mutate } = useSWR(key, fetcher);
  return { data: data?.data ?? [], pagination: data?.pagination, error, isLoading, refresh: mutate };
}

export const useUpcomingEvents = () => {
  const { data, error, isLoading } = useSWR("events/upcoming", () => apiClient.get<Event[]>(API_CONFIG.ENDPOINTS.UPCOMING_EVENTS));
  return { data: data?.data ?? [], error, isLoading };
};

export const useLiveEvents = () => {
  const { data, error, isLoading } = useSWR("events/live", () => apiClient.get<Event[]>(API_CONFIG.ENDPOINTS.LIVE_EVENTS));
  return { data: data?.data ?? [], error, isLoading };
};
