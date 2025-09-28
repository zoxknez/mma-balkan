"use client";
import useSWR from "swr";
import { getClubs, type ClubQuery } from "@/lib/api/clubs";

export function useClubs(params: ClubQuery = {}) {
  const { data, error, isLoading, mutate } = useSWR(["clubs", params], () => getClubs(params));
  return { data: data?.data ?? [], pagination: data?.pagination, error, isLoading, refresh: mutate };
}

export function useClub(id: string | undefined) {
  const { data, error, isLoading, mutate } = useSWR(id ? ["club", id] : null, () => getClubs({}));
  return { data: data?.data?.[0], error, isLoading, refresh: mutate };
}
