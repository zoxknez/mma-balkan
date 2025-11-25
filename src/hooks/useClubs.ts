"use client";
import useSWR from "swr";
import { getClubs, getClubById, type ClubQuery, type Club } from "@/lib/api/clubs";
import { swrConfig } from "@/lib/swr-config";

export type { Club };

export function useClubs(params: ClubQuery = {}) {
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    ["clubs", JSON.stringify(params)], 
    () => getClubs(params),
    swrConfig
  );
  return { 
    data: data?.data ?? [], 
    pagination: data?.pagination, 
    error, 
    isLoading, 
    isValidating,
    refresh: mutate 
  };
}

export function useClub(id: string | undefined) {
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    id ? ["club", id] : null, 
    () => getClubById(id!),
    swrConfig
  );
  return { 
    data: data?.data, 
    error, 
    isLoading, 
    isValidating,
    refresh: mutate 
  };
}
