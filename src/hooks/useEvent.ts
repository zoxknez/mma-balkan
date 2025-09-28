"use client";
import useSWR from "swr";
import { apiClient, API_CONFIG } from "@/lib/api/client";

export type ApiEvent = {
  id: string;
  name: string;
  startAt: string;
  status: "SCHEDULED" | "LIVE" | "COMPLETED" | "CANCELLED" | string;
  city: string;
  country: string;
  mainEvent?: string | null;
  ticketsAvailable: boolean;
  fightsCount: number;
  attendees?: number | null;
};

export function useEvent(id?: string) {
  const key = id ? ["event", id] : null;
  const fetcher = async () => apiClient.get<ApiEvent>(API_CONFIG.ENDPOINTS.EVENT_BY_ID(id!));
  const { data, error, isLoading, mutate } = useSWR(key, fetcher);
  return { data: data?.data, error, isLoading, refresh: mutate };
}
