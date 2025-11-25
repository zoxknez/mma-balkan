"use client";

import { useState, useCallback, useEffect, useRef } from 'react';

type AsyncFunction<T, Args extends unknown[]> = (...args: Args) => Promise<T>;

interface AsyncState<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}

interface UseAsyncOptions {
  onSuccess?: (data: unknown) => void;
  onError?: (error: Error) => void;
  retryCount?: number;
  retryDelay?: number;
}

/**
 * Hook for handling async operations with loading, error, and success states
 */
export function useAsync<T, Args extends unknown[] = []>(
  asyncFn: AsyncFunction<T, Args>,
  options: UseAsyncOptions = {}
) {
  const { onSuccess, onError, retryCount = 0, retryDelay = 1000 } = options;

  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    error: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
  });

  const mountedRef = useRef(true);
  const retriesRef = useRef(0);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const execute = useCallback(
    async (...args: Args): Promise<T | null> => {
      setState({
        data: null,
        error: null,
        isLoading: true,
        isSuccess: false,
        isError: false,
      });

      const attemptExecution = async (): Promise<T | null> => {
        try {
          const data = await asyncFn(...args);

          if (mountedRef.current) {
            setState({
              data,
              error: null,
              isLoading: false,
              isSuccess: true,
              isError: false,
            });
            onSuccess?.(data);
          }

          retriesRef.current = 0;
          return data;
        } catch (error) {
          const err = error instanceof Error ? error : new Error(String(error));

          // Retry logic
          if (retriesRef.current < retryCount) {
            retriesRef.current++;
            await new Promise((resolve) =>
              setTimeout(resolve, retryDelay * retriesRef.current)
            );
            return attemptExecution();
          }

          if (mountedRef.current) {
            setState({
              data: null,
              error: err,
              isLoading: false,
              isSuccess: false,
              isError: true,
            });
            onError?.(err);
          }

          retriesRef.current = 0;
          return null;
        }
      };

      return attemptExecution();
    },
    [asyncFn, onSuccess, onError, retryCount, retryDelay]
  );

  const reset = useCallback(() => {
    setState({
      data: null,
      error: null,
      isLoading: false,
      isSuccess: false,
      isError: false,
    });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

/**
 * Hook for handling form submissions with async operations
 */
export function useAsyncSubmit<T>(
  submitFn: (data: T) => Promise<unknown>,
  options: UseAsyncOptions = {}
) {
  const { execute, ...state } = useAsync(submitFn, options);

  const handleSubmit = useCallback(
    async (data: T) => {
      return execute(data);
    },
    [execute]
  );

  return {
    ...state,
    submit: handleSubmit,
  };
}

/**
 * Hook for handling mutations (create, update, delete)
 */
export function useMutation<T, Args extends unknown[] = []>(
  mutationFn: AsyncFunction<T, Args>,
  options: UseAsyncOptions & {
    invalidateKeys?: string[];
    optimisticData?: T;
  } = {}
) {
  const { invalidateKeys, optimisticData, ...asyncOptions } = options;
  const [optimisticState, setOptimisticState] = useState<T | null>(null);

  const {
    execute,
    reset,
    data,
    error,
    isLoading,
    isSuccess,
    isError,
  } = useAsync(mutationFn, {
    ...asyncOptions,
    onSuccess: (responseData) => {
      setOptimisticState(null);

      // Invalidate SWR cache if keys provided
      if (invalidateKeys && typeof window !== 'undefined') {
        // Import SWR mutate dynamically to avoid circular deps
        import('swr').then(({ mutate }) => {
          invalidateKeys.forEach((key) => {
            mutate((k: unknown) => {
              if (typeof k === 'string') return k.startsWith(key);
              if (Array.isArray(k)) return k[0] === key;
              return false;
            });
          });
        });
      }

      asyncOptions.onSuccess?.(responseData);
    },
    onError: (err) => {
      setOptimisticState(null);
      asyncOptions.onError?.(err);
    },
  });

  const mutate = useCallback(
    async (...args: Args): Promise<T | null> => {
      // Apply optimistic update if provided
      if (optimisticData) {
        setOptimisticState(optimisticData);
      }

      return execute(...args);
    },
    [execute, optimisticData]
  );

  return {
    mutate,
    reset,
    data: optimisticState ?? data,
    error,
    isLoading,
    isSuccess,
    isError,
    isOptimistic: optimisticState !== null,
  };
}

/**
 * Hook for polling data at intervals
 */
export function usePolling<T>(
  fetchFn: () => Promise<T>,
  intervalMs: number,
  options: {
    enabled?: boolean;
    onSuccess?: (data: T) => void;
    onError?: (error: Error) => void;
  } = {}
) {
  const { enabled = true, onSuccess, onError } = options;
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const fetchData = useCallback(async () => {
    if (!mountedRef.current) return;

    setIsLoading(true);
    try {
      const result = await fetchFn();
      if (mountedRef.current) {
        setData(result);
        setError(null);
        onSuccess?.(result);
      }
    } catch (err) {
      if (mountedRef.current) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        onError?.(error);
      }
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [fetchFn, onSuccess, onError]);

  useEffect(() => {
    if (!enabled) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Initial fetch
    fetchData();

    // Set up polling
    intervalRef.current = setInterval(fetchData, intervalMs);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [enabled, intervalMs, fetchData]);

  const refetch = useCallback(() => {
    return fetchData();
  }, [fetchData]);

  return {
    data,
    error,
    isLoading,
    refetch,
  };
}
