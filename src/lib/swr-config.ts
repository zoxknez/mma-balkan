'use client';

import { SWRConfiguration } from 'swr';
import * as Sentry from '@sentry/nextjs';
import { apiClient } from './api/client';

// SWR fetcher with error handling
export const fetcher = async <T>(url: string): Promise<T> => {
  const response = await apiClient.get<T>(url);
  
  if (!response.success) {
    throw new Error(response.error || 'Failed to fetch data');
  }
  
  return response.data as T;
};

// Optimized SWR configuration
export const swrConfig: SWRConfiguration = {
  // Deduplication interval
  dedupingInterval: 2000, // 2 seconds

  // Revalidation
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
  revalidateIfStale: true,
  
  // Polling (disabled by default, enable per-hook if needed)
  refreshInterval: 0,
  
  // Error retry with exponential backoff
  errorRetryCount: 3,
  errorRetryInterval: 5000,
  onErrorRetry: (error, _key, _config, revalidate, { retryCount }) => {
    // Stop retry for 4xx errors (client errors)
    if (error.status >= 400 && error.status < 500) {
      return;
    }

    // Max 3 retries
    if (retryCount >= 3) {
      return;
    }

    // Exponential backoff: 1s, 2s, 4s
    const timeout = Math.min(1000 * Math.pow(2, retryCount), 10000);
    
    setTimeout(() => revalidate({ retryCount }), timeout);
  },

  // Cache provider (use in-memory cache)
  provider: () => new Map(),

  // Keep previous data while revalidating
  keepPreviousData: true,

  // Compare function for data equality
  // Using a more efficient deep equality check
  compare: (a, b) => {
    // Quick reference check
    if (a === b) return true;
    if (a === null || b === null) return a === b;
    if (typeof a !== typeof b) return false;
    
    // For arrays, compare length first
    if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length !== b.length) return false;
    }
    
    // Fallback to JSON stringify for deep comparison
    // Note: For large objects, consider using fast-deep-equal package
    try {
      return JSON.stringify(a) === JSON.stringify(b);
    } catch {
      return false;
    }
  },

  // Loading timeout
  loadingTimeout: 3000,
  onLoadingSlow: (key) => {
    console.warn(`🐌 Slow data loading for: ${key}`);
  },

  // Success callback
  onSuccess: (data, key) => {
    if (process.env.NODE_ENV !== 'production') {
      console.debug('✅ SWR success:', key);
    }
  },

  // Error callback
  onError: (error, key) => {
    console.error('❌ SWR error:', key, error);
    
    // Send to error tracking
    Sentry.captureException(error, {
      tags: { swrKey: key },
    });
  },

  // Suspense support
  suspense: false, // Enable per-hook when needed

  // Focus throttle
  focusThrottleInterval: 5000,
};

// Optimized fetcher for paginated data
export const paginatedFetcher = async <T>(url: string): Promise<{
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}> => {
  const response = await apiClient.get<T[]>(url);
  
  if (!response.success) {
    throw new Error(response.error || 'Failed to fetch data');
  }
  
  return {
    data: response.data || [],
    pagination: response.pagination || {
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 0,
    },
  };
};

// Infinite scroll fetcher
export const infiniteFetcher = (url: string) => fetcher(url);

