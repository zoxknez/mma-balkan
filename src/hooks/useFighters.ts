"use client";
import useSWR from "swr";
import FighterService from "@/lib/api/fighters";

export function useFighters(params: Parameters<typeof FighterService.getFighters>[0]) {
  const { data, error, isLoading, mutate } = useSWR(["fighters", params], () => FighterService.getFighters(params));
  return { data: data?.data ?? [], pagination: data?.pagination, error, isLoading, refresh: mutate };
}

export function useTrendingFighters(limit: number = 10) {
  const { data, error, isLoading } = useSWR(["fighters/trending", limit], () => FighterService.getTrendingFighters(limit));
  return { data: data?.data ?? [], error, isLoading };
}
