"use client";
import useSWR from "swr";
import { apiClient, API_CONFIG } from "@/lib/api/client";

export type ApiClub = {
  id: string;
  name: string;
  city: string;
  country: string;
  address?: string | null;
  website?: string | null;
  phone?: string | null;
  members?: number | null;
};

export function useClub(id?: string) {
  const key = id ? ["club", id] : null;
  const fetcher = async () => apiClient.get<ApiClub>(API_CONFIG.ENDPOINTS.CLUB_BY_ID(id!));
  const { data, error, isLoading, mutate } = useSWR(key, fetcher);
  return { data: data?.data, error, isLoading, refresh: mutate };
}
