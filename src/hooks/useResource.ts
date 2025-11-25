"use client";
import useSWR, { SWRConfiguration, useSWRConfig } from "swr";
import { swrConfig } from "@/lib/swr-config";
import { ApiResponse } from "@/lib/api/client";

/**
 * Generic hook factory for creating resource hooks with consistent patterns.
 * Reduces code duplication across useEvents, useFighters, useClubs, etc.
 * 
 * @example
 * // Create a typed hook for fighters
 * const useFightersResource = createResourceHook<Fighter[], FighterQueryParams>(
 *   'fighters',
 *   FighterService.getFighters
 * );
 * 
 * // Use in component
 * const { data, isLoading, refresh } = useFightersResource({ limit: 10 });
 */

export interface ResourceHookResult<T> {
  data: T;
  error: Error | undefined;
  isLoading: boolean;
  isValidating: boolean;
  refresh: () => Promise<ApiResponse<T> | undefined>;
}

export interface PaginatedResourceHookResult<T> extends Omit<ResourceHookResult<T>, 'data'> {
  data: T;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | undefined;
}

export type ResourceFetcher<T, P> = (params: P) => Promise<ApiResponse<T>>;

/**
 * Creates a hook for fetching paginated resources with SWR
 */
export function createResourceHook<T extends unknown[], P = Record<string, unknown>>(
  resourceKey: string,
  fetcher: ResourceFetcher<T, P>,
  customConfig?: Partial<SWRConfiguration>
) {
  return function useResource(
    params: P,
    options?: { enabled?: boolean }
  ): PaginatedResourceHookResult<T> {
    const enabled = options?.enabled ?? true;
    
    // Serialize params to ensure stable key
    const key = enabled ? [resourceKey, JSON.stringify(params)] : null;
    
    const { data, error, isLoading, isValidating, mutate } = useSWR<ApiResponse<T>>(
      key,
      () => fetcher(params),
      {
        ...swrConfig,
        ...customConfig,
      }
    );

    return {
      data: (data?.data ?? []) as T,
      pagination: data?.pagination,
      error,
      isLoading,
      isValidating,
      refresh: () => mutate(),
    };
  };
}

/**
 * Creates a hook for fetching a single resource by ID
 */
export function createSingleResourceHook<T>(
  resourceKey: string,
  fetcher: (id: string) => Promise<ApiResponse<T>>,
  customConfig?: Partial<SWRConfiguration>
) {
  return function useSingleResource(
    id: string | undefined
  ): ResourceHookResult<T | undefined> {
    const key = id ? [resourceKey, id] : null;
    
    const { data, error, isLoading, isValidating, mutate } = useSWR<ApiResponse<T>>(
      key,
      () => fetcher(id!),
      {
        ...swrConfig,
        ...customConfig,
      }
    );

    return {
      data: data?.data,
      error,
      isLoading,
      isValidating,
      refresh: () => mutate(),
    };
  };
}

/**
 * Hook for infinite scrolling / pagination
 */
export function createInfiniteResourceHook<T, P extends { page?: number; limit?: number }>(
  resourceKey: string,
  fetcher: ResourceFetcher<T[], P>,
  customConfig?: Partial<SWRConfiguration>
) {
  return function useInfiniteResource(baseParams: Omit<P, 'page'>) {
    const pages: T[][] = [];
    let currentPage = 1;
    let hasMore = true;
    
    // This is a simplified version - for production use useSWRInfinite
    const key = [resourceKey, 'infinite', JSON.stringify(baseParams)];
    
    const { data, error, isLoading, isValidating, mutate } = useSWR<ApiResponse<T[]>>(
      key,
      () => fetcher({ ...baseParams, page: currentPage } as P),
      {
        ...swrConfig,
        ...customConfig,
      }
    );

    if (data?.data) {
      pages.push(data.data);
    }
    
    if (data?.pagination) {
      hasMore = data.pagination.page < data.pagination.totalPages;
    }

    return {
      data: pages.flat(),
      pagination: data?.pagination,
      error,
      isLoading,
      isValidating,
      hasMore,
      loadMore: async () => {
        if (hasMore) {
          currentPage++;
          await mutate();
        }
      },
      refresh: () => mutate(),
    };
  };
}

/**
 * Utility hook for prefetching resources
 */
export function usePrefetchResource<T, P>(
  resourceKey: string,
  fetcher: ResourceFetcher<T, P>
) {
  const { mutate } = useSWRConfig();
  
  return async (params: P) => {
    const key = [resourceKey, JSON.stringify(params)];
    await mutate(key, () => fetcher(params));
  };
}
