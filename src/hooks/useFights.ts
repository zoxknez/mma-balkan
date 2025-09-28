"use client";
import useSWR from 'swr';
import { getEventFights, getFighterFights, getFighterUpcomingFights, Fight } from '@/lib/api/fights';

export function useEventFights(eventId?: string) {
  const key = eventId ? ['event-fights', eventId] : null;
  const fetcher = async () => getEventFights(eventId!).then(r => r.data ?? []);
  const { data, error, isLoading, mutate } = useSWR<Fight[]>(key, fetcher);
  return { data, error, isLoading, refresh: mutate };
}

export function useFighterHistory(fighterId?: string) {
  const key = fighterId ? ['fighter-history', fighterId] : null;
  const fetcher = async () => getFighterFights(fighterId!).then(r => r.data ?? []);
  const { data, error, isLoading, mutate } = useSWR<Fight[]>(key, fetcher);
  return { data, error, isLoading, refresh: mutate };
}

export function useFighterUpcoming(fighterId?: string) {
  const key = fighterId ? ['fighter-upcoming', fighterId] : null;
  const fetcher = async () => getFighterUpcomingFights(fighterId!).then(r => r.data ?? []);
  const { data, error, isLoading, mutate } = useSWR<Fight[]>(key, fetcher);
  return { data, error, isLoading, refresh: mutate };
}
