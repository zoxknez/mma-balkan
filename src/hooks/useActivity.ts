"use client";
import { useEffect, useRef, useCallback } from 'react';
import useSWR, { useSWRConfig } from 'swr';

export type ActivityItem = {
  id: string;
  user: string;
  action: string;
  timeAgo: string;
  timeISO?: string;
};

const fetchActivity = async (url: string): Promise<ActivityItem[]> => {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  return Array.isArray(json?.data) ? json.data : [];
};

// SSE reconnection configuration
const SSE_CONFIG = {
  maxRetries: 5,
  initialDelayMs: 1000,
  maxDelayMs: 30000,
  backoffMultiplier: 2,
};

export function useActivity() {
  const { mutate } = useSWRConfig();
  const baseUrl = process.env['NEXT_PUBLIC_API_URL'] || 'http://localhost:3003';
  const activityUrl = `${baseUrl}/api/activity/recent`;
  
  // Track retry state
  const retryCountRef = useRef(0);
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { data: items = [] } = useSWR(activityUrl, fetchActivity, {
    refreshInterval: 30000, // Fallback polling every 30s
    dedupingInterval: 10000,
    fallbackData: [],
  });

  const calculateBackoff = useCallback((retryCount: number): number => {
    const delay = SSE_CONFIG.initialDelayMs * Math.pow(SSE_CONFIG.backoffMultiplier, retryCount);
    // Add jitter to prevent thundering herd
    const jitter = Math.random() * 1000;
    return Math.min(delay + jitter, SSE_CONFIG.maxDelayMs);
  }, []);

  const startSSE = useCallback(() => {
    // Clean up existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    try {
      const es = new EventSource(`${baseUrl}/api/activity/stream`);
      eventSourceRef.current = es;
      
      es.addEventListener('hello', (e: MessageEvent) => {
        try {
          const payload = JSON.parse(e.data) as { data?: ActivityItem[] };
          if (payload?.data) {
            mutate(activityUrl, payload.data, false);
          }
          // Reset retry count on successful connection
          retryCountRef.current = 0;
        } catch (parseError) {
          console.warn('[useActivity] Failed to parse hello payload:', parseError);
        }
      });

      es.addEventListener('activity', (e: MessageEvent) => {
        try {
          const payload = JSON.parse(e.data) as { data?: ActivityItem };
          if (payload?.data) {
            mutate(activityUrl, (old: ActivityItem[] | undefined) => {
              return [payload.data!, ...(old || [])].slice(0, 20);
            }, false);
          }
        } catch (parseError) {
          console.warn('[useActivity] Failed to parse activity payload:', parseError);
        }
      });

      es.onerror = () => {
        es.close();
        eventSourceRef.current = null;
        
        // Attempt reconnection with exponential backoff
        if (retryCountRef.current < SSE_CONFIG.maxRetries) {
          const delay = calculateBackoff(retryCountRef.current);
          console.log(`[useActivity] SSE error, reconnecting in ${Math.round(delay)}ms (attempt ${retryCountRef.current + 1}/${SSE_CONFIG.maxRetries})`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            retryCountRef.current++;
            startSSE();
          }, delay);
        } else {
          console.log('[useActivity] SSE max retries reached, falling back to polling');
        }
      };

      es.onopen = () => {
        // Reset retry count on successful connection
        retryCountRef.current = 0;
      };
    } catch (initError) {
      console.warn('[useActivity] SSE initialization failed:', initError);
      // Will rely on SWR polling as fallback
    }
  }, [baseUrl, mutate, activityUrl, calculateBackoff]);

  useEffect(() => {
    startSSE();

    return () => {
      // Clean up on unmount
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    };
  }, [startSSE]);

  return items;
}
