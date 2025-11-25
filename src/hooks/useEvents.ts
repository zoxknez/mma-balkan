"use client";
import useSWR from "swr";
import { getEvents, getUpcomingEvents, getLiveEvents, Event, EventQuery } from "@/lib/api/events";
import { swrConfig } from "@/lib/swr-config";

export type { Event };

// Custom SWR config for events
const eventsConfig = {
  ...swrConfig,
  // Events change frequently, especially during live events
  refreshInterval: 60000, // 1 minute
  dedupingInterval: 5000,
};

export function useEvents(params: EventQuery) {
  // Serialize params to ensure stable key
  const key = params ? ["events", JSON.stringify(params)] : null;
  
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    key, 
    () => getEvents(params),
    eventsConfig
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

export const useUpcomingEvents = (limit?: number) => {
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    ["events/upcoming", limit], 
    () => getUpcomingEvents(limit),
    {
      ...eventsConfig,
      // Upcoming events don't change as frequently
      refreshInterval: 5 * 60 * 1000, // 5 minutes
    }
  );
  return { 
    data: data?.data ?? [], 
    error, 
    isLoading,
    isValidating,
    refresh: mutate
  };
};

export const useLiveEvents = () => {
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    "events/live", 
    () => getLiveEvents(),
    {
      ...eventsConfig,
      // Live events need frequent updates
      refreshInterval: 10000, // 10 seconds
      revalidateOnFocus: true,
    }
  );
  return { 
    data: data?.data ?? [], 
    error, 
    isLoading,
    isValidating,
    refresh: mutate
  };
};
