"use client";
import useSWR from "swr";
import { apiClient, API_CONFIG } from "@/lib/api/client";

export type ApiFighter = {
  id: string;
  name: string;
  nickname?: string;
  country: string;
  countryCode: string;
  birthDate?: string;
  heightCm?: number;
  weightKg?: number;
  weightClass: string;
  reachCm?: number;
  stance?: string;
  wins: number;
  losses: number;
  draws: number;
  koTkoWins?: number;
  submissionWins?: number;
  decisionWins?: number;
  isActive: boolean;
  lastFight?: string;
};

export function useFighter(id?: string) {
  const key = id ? ["fighter", id] : null;
  const fetcher = async () => apiClient.get<ApiFighter>(API_CONFIG.ENDPOINTS.FIGHTER_BY_ID(id!));
  const { data, error, isLoading, mutate } = useSWR(key, fetcher);
  return { data: data?.data, error, isLoading, refresh: mutate };
}
