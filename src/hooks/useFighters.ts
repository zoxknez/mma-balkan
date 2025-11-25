"use client";
import useSWR, { SWRConfiguration } from "swr";
import FighterService from "@/lib/api/fighters";
import { swrConfig } from "@/lib/swr-config";

// Custom SWR config for fighters
const fightersConfig: SWRConfiguration = {
  ...swrConfig,
  // Revalidate every 5 minutes for fighter data
  refreshInterval: 5 * 60 * 1000,
  // Keep data fresh
  dedupingInterval: 5000,
};

export function useFighters(params: Parameters<typeof FighterService.getFighters>[0]) {
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    params ? ["fighters", JSON.stringify(params)] : null,
    () => FighterService.getFighters(params),
    fightersConfig
  );

  return {
    data: data?.data ?? [],
    pagination: data?.pagination,
    error,
    isLoading,
    isValidating,
    refresh: mutate,
  };
}

export function useTrendingFighters(limit: number = 10) {
  const { data, error, isLoading, mutate } = useSWR(
    ["fighters/trending", limit],
    () => FighterService.getTrendingFighters(limit),
    {
      ...swrConfig,
      // Cache trending fighters for 2 minutes
      dedupingInterval: 2 * 60 * 1000,
      // Revalidate on window focus
      revalidateOnFocus: true,
    }
  );

  return {
    data: data?.data ?? [],
    error,
    isLoading,
    refresh: mutate,
  };
}
