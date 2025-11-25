'use client';

import { useCallback } from 'react';
import { logger } from '@/lib/logger';

export interface ErrorInfo {
  component?: string;
  action?: string;
  context?: Record<string, unknown>;
}

export function useErrorHandler() {
  const handleError = useCallback((
    error: Error | string,
    errorInfo?: ErrorInfo
  ) => {
    const errorMessage = typeof error === 'string' ? error : error.message;
    const errorStack = typeof error === 'string' ? undefined : error.stack;

    // Log error
    logger.error('Error caught:', {
      message: errorMessage,
      stack: errorStack,
      ...errorInfo
    });

    // In production, send to error reporting service
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry.captureException(error, { extra: errorInfo });
      // You can add your error reporting service here
    }

    // Show user-friendly error message
    // You can integrate with a toast notification system here
    console.error('User-facing error:', errorMessage);
  }, []);

  const handleAsyncError = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    errorInfo?: ErrorInfo
  ): Promise<T | null> => {
    try {
      return await asyncFn();
    } catch (error) {
      handleError(error as Error, errorInfo);
      return null;
    }
  }, [handleError]);

  return {
    handleError,
    handleAsyncError
  };
}

// Hook for API error handling
export function useApiErrorHandler() {
  const { handleError } = useErrorHandler();

  const handleApiError = useCallback((
    error: unknown,
    context: { endpoint: string; method: string }
  ) => {
    let errorMessage = 'An unexpected error occurred';
    let errorCode = 'UNKNOWN_ERROR';

    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'object' && error !== null) {
      const apiError = error as { message?: string; code?: string; status?: number };
      errorMessage = apiError.message || errorMessage;
      errorCode = apiError.code || errorCode;
    }

    handleError(new Error(errorMessage), {
      component: 'API',
      action: `${context.method} ${context.endpoint}`,
      context: {
        errorCode,
        ...context
      }
    });

    return {
      message: errorMessage,
      code: errorCode
    };
  }, [handleError]);

  return { handleApiError };
}
