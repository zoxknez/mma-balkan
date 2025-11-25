'use client';

import { useCallback, useRef, useEffect, useMemo } from 'react';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  maxSize?: number; // Maximum number of entries
}

export function useCache<T = unknown>(options: CacheOptions = {}) {
  const cacheRef = useRef<Map<string, CacheEntry<T>>>(new Map());
  const { ttl = 5 * 60 * 1000, maxSize = 100 } = options; // 5 minutes default TTL

  const get = useCallback((key: string): T | null => {
    const entry = cacheRef.current.get(key);
    
    if (!entry) {
      return null;
    }

    // Check if entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      cacheRef.current.delete(key);
      return null;
    }

    return entry.data;
  }, []);

  const set = useCallback((key: string, data: T, customTtl?: number): void => {
    // Remove oldest entries if cache is full
    if (cacheRef.current.size >= maxSize) {
      const firstKey = cacheRef.current.keys().next().value;
      if (firstKey) {
        cacheRef.current.delete(firstKey);
      }
    }

    cacheRef.current.set(key, {
      data,
      timestamp: Date.now(),
      ttl: customTtl || ttl
    });
  }, [ttl, maxSize]);

  const has = useCallback((key: string): boolean => {
    const entry = cacheRef.current.get(key);
    if (!entry) return false;
    
    // Check if entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      cacheRef.current.delete(key);
      return false;
    }
    
    return true;
  }, []);

  const deleteKey = useCallback((key: string): boolean => {
    return cacheRef.current.delete(key);
  }, []);

  const clear = useCallback((): void => {
    cacheRef.current.clear();
  }, []);

  const getSize = useCallback(() => cacheRef.current.size, []);

  // Cleanup expired entries periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      for (const [key, entry] of cacheRef.current.entries()) {
        if (now - entry.timestamp > entry.ttl) {
          cacheRef.current.delete(key);
        }
      }
    }, 60000); // Cleanup every minute

    return () => clearInterval(interval);
  }, []);

  return useMemo(() => ({
    get,
    set,
    has,
    delete: deleteKey,
    clear,
    getSize
  }), [get, set, has, deleteKey, clear, getSize]);
}

// Hook for API response caching
export function useApiCache<T = unknown>(options: CacheOptions = {}) {
  const cache = useCache<T>(options);

  const getCachedResponse = useCallback(async (
    key: string,
    fetcher: () => Promise<T>
  ): Promise<T> => {
    const cached = cache.get(key);
    if (cached) {
      return cached;
    }

    const data = await fetcher();
    cache.set(key, data);
    return data;
  }, [cache]);

  return useMemo(() => ({
    ...cache,
    getCachedResponse
  }), [cache, getCachedResponse]);
}

// Hook for expensive computations caching
export function useMemoizedValue<T>(
  computeFn: () => T,
  deps: React.DependencyList,
  options: CacheOptions = {}
): T {
  const cache = useCache<T>(options);
  const depsKey = JSON.stringify(deps);

  return useMemo(() => {
    const cached = cache.get(depsKey);
    if (cached) {
      return cached;
    }

    const computed = computeFn();
    cache.set(depsKey, computed);
    return computed;
  }, [cache, computeFn, depsKey]);
}
