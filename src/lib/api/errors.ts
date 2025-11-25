/**
 * API Error Types and Handling Utilities
 * Provides consistent error handling across the application
 */

// Standard error codes
export enum ApiErrorCode {
  // Client errors (4xx)
  BAD_REQUEST = 'BAD_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  TOO_MANY_REQUESTS = 'TOO_MANY_REQUESTS',
  
  // Server errors (5xx)
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  
  // Network errors
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT = 'TIMEOUT',
  
  // Unknown
  UNKNOWN = 'UNKNOWN',
}

// Map HTTP status codes to error codes
const statusCodeToErrorCode: Record<number, ApiErrorCode> = {
  400: ApiErrorCode.BAD_REQUEST,
  401: ApiErrorCode.UNAUTHORIZED,
  403: ApiErrorCode.FORBIDDEN,
  404: ApiErrorCode.NOT_FOUND,
  409: ApiErrorCode.CONFLICT,
  422: ApiErrorCode.VALIDATION_ERROR,
  429: ApiErrorCode.TOO_MANY_REQUESTS,
  500: ApiErrorCode.INTERNAL_ERROR,
  502: ApiErrorCode.SERVICE_UNAVAILABLE,
  503: ApiErrorCode.SERVICE_UNAVAILABLE,
  504: ApiErrorCode.TIMEOUT,
};

export interface ApiError {
  code: ApiErrorCode;
  message: string;
  statusCode?: number | undefined;
  details?: Record<string, unknown> | undefined;
  retryable: boolean;
  timestamp: Date;
}

// User-friendly error messages (Serbian/English)
const userFriendlyMessages: Record<ApiErrorCode, { sr: string; en: string }> = {
  [ApiErrorCode.BAD_REQUEST]: {
    sr: 'Neispravan zahtjev. Provjerite unijete podatke.',
    en: 'Invalid request. Please check your input.',
  },
  [ApiErrorCode.UNAUTHORIZED]: {
    sr: 'Niste prijavljeni. Molimo prijavite se.',
    en: 'You are not logged in. Please log in.',
  },
  [ApiErrorCode.FORBIDDEN]: {
    sr: 'Nemate dozvolu za ovu akciju.',
    en: 'You do not have permission for this action.',
  },
  [ApiErrorCode.NOT_FOUND]: {
    sr: 'Traženi resurs nije pronađen.',
    en: 'The requested resource was not found.',
  },
  [ApiErrorCode.CONFLICT]: {
    sr: 'Konflikt podataka. Resurs već postoji ili je izmijenjen.',
    en: 'Data conflict. Resource already exists or has been modified.',
  },
  [ApiErrorCode.VALIDATION_ERROR]: {
    sr: 'Validacija nije uspjela. Provjerite unijete podatke.',
    en: 'Validation failed. Please check your input.',
  },
  [ApiErrorCode.TOO_MANY_REQUESTS]: {
    sr: 'Previše zahtjeva. Molimo pričekajte nekoliko minuta.',
    en: 'Too many requests. Please wait a few minutes.',
  },
  [ApiErrorCode.INTERNAL_ERROR]: {
    sr: 'Greška na serveru. Molimo pokušajte ponovo.',
    en: 'Server error. Please try again.',
  },
  [ApiErrorCode.SERVICE_UNAVAILABLE]: {
    sr: 'Servis je trenutno nedostupan. Pokušajte ponovo kasnije.',
    en: 'Service is currently unavailable. Please try again later.',
  },
  [ApiErrorCode.NETWORK_ERROR]: {
    sr: 'Greška u mreži. Provjerite svoju internet vezu.',
    en: 'Network error. Please check your internet connection.',
  },
  [ApiErrorCode.TIMEOUT]: {
    sr: 'Zahtjev je istekao. Pokušajte ponovo.',
    en: 'Request timed out. Please try again.',
  },
  [ApiErrorCode.UNKNOWN]: {
    sr: 'Nepoznata greška. Pokušajte ponovo.',
    en: 'Unknown error. Please try again.',
  },
};

// Retryable error codes
const retryableErrors = new Set([
  ApiErrorCode.INTERNAL_ERROR,
  ApiErrorCode.SERVICE_UNAVAILABLE,
  ApiErrorCode.TIMEOUT,
  ApiErrorCode.NETWORK_ERROR,
  ApiErrorCode.TOO_MANY_REQUESTS,
]);

/**
 * Parse an error into a structured ApiError
 */
export function parseApiError(error: unknown, statusCode?: number): ApiError {
  const timestamp = new Date();

  // Handle network/fetch errors
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return {
      code: ApiErrorCode.NETWORK_ERROR,
      message: error.message,
      retryable: true,
      timestamp,
    };
  }

  // Handle abort errors (timeout)
  if (error instanceof DOMException && error.name === 'AbortError') {
    return {
      code: ApiErrorCode.TIMEOUT,
      message: 'Request was aborted or timed out',
      retryable: true,
      timestamp,
    };
  }

  // Handle Error instances
  if (error instanceof Error) {
    const code = statusCode 
      ? statusCodeToErrorCode[statusCode] || ApiErrorCode.UNKNOWN
      : ApiErrorCode.UNKNOWN;
    
    return {
      code,
      message: error.message,
      statusCode,
      retryable: retryableErrors.has(code),
      timestamp,
    };
  }

  // Handle API response errors
  if (typeof error === 'object' && error !== null) {
    const err = error as Record<string, unknown>;
    const code = statusCode
      ? statusCodeToErrorCode[statusCode] || ApiErrorCode.UNKNOWN
      : ApiErrorCode.UNKNOWN;

    return {
      code,
      message: (err['message'] as string) || (err['error'] as string) || 'Unknown error',
      statusCode,
      details: err['details'] as Record<string, unknown>,
      retryable: retryableErrors.has(code),
      timestamp,
    };
  }

  // Fallback for unknown error types
  return {
    code: ApiErrorCode.UNKNOWN,
    message: String(error),
    retryable: false,
    timestamp,
  };
}

/**
 * Get user-friendly error message
 */
export function getUserFriendlyMessage(
  error: ApiError,
  locale: 'sr' | 'en' = 'sr'
): string {
  const messages = userFriendlyMessages[error.code];
  return messages?.[locale] || error.message;
}

/**
 * Check if error is retryable
 */
export function isRetryableError(error: ApiError): boolean {
  return error.retryable;
}

/**
 * Check if error requires authentication
 */
export function isAuthError(error: ApiError): boolean {
  return error.code === ApiErrorCode.UNAUTHORIZED;
}

/**
 * Check if error is a rate limit error
 */
export function isRateLimitError(error: ApiError): boolean {
  return error.code === ApiErrorCode.TOO_MANY_REQUESTS;
}

/**
 * Error boundary hook context type
 */
export interface ErrorContext {
  error: ApiError | null;
  setError: (error: ApiError | null) => void;
  clearError: () => void;
  handleError: (error: unknown, statusCode?: number) => void;
}

/**
 * Create toast-friendly error message
 */
export function createErrorToast(
  error: ApiError,
  locale: 'sr' | 'en' = 'sr'
): {
  title: string;
  description: string;
  variant: 'destructive' | 'warning';
} {
  const isWarning = error.code === ApiErrorCode.TOO_MANY_REQUESTS;
  
  const titles = {
    destructive: { sr: 'Greška', en: 'Error' },
    warning: { sr: 'Upozorenje', en: 'Warning' },
  } as const;

  const variant = isWarning ? 'warning' : 'destructive';

  return {
    title: titles[variant][locale],
    description: getUserFriendlyMessage(error, locale),
    variant: isWarning ? 'warning' : 'destructive',
  };
}

/**
 * Format validation errors for form display
 */
export function formatValidationErrors(
  details: Record<string, unknown> | undefined
): Record<string, string> {
  if (!details) return {};

  const errors: Record<string, string> = {};

  // Handle Zod-style errors
  if (details['errors'] && typeof details['errors'] === 'object') {
    const zodErrors = details['errors'] as Record<string, string[]>;
    for (const [field, messages] of Object.entries(zodErrors)) {
      if (Array.isArray(messages) && messages.length > 0 && messages[0]) {
        errors[field] = messages[0];
      }
    }
  }

  // Handle flat error object
  for (const [field, message] of Object.entries(details)) {
    if (typeof message === 'string' && field !== 'errors') {
      errors[field] = message;
    }
  }

  return errors;
}

/**
 * Log error for debugging (non-production)
 */
export function logApiError(
  error: ApiError,
  context?: {
    endpoint?: string;
    method?: string;
    userId?: string;
  }
): void {
  if (process.env.NODE_ENV === 'development') {
    console.group(`🔴 API Error: ${error.code}`);
    console.error('Message:', error.message);
    if (error.statusCode) console.error('Status:', error.statusCode);
    if (error.details) console.error('Details:', error.details);
    if (context) console.error('Context:', context);
    console.error('Timestamp:', error.timestamp.toISOString());
    console.error('Retryable:', error.retryable);
    console.groupEnd();
  }
}

/**
 * Retry helper with exponential backoff
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number;
    baseDelay?: number;
    maxDelay?: number;
    shouldRetry?: (error: unknown) => boolean;
  } = {}
): Promise<T> {
  const {
    maxRetries = 3,
    baseDelay = 1000,
    maxDelay = 10000,
    shouldRetry = () => true,
  } = options;

  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt === maxRetries || !shouldRetry(error)) {
        throw error;
      }

      // Calculate delay with exponential backoff and jitter
      const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
      const jitter = delay * 0.2 * Math.random();
      
      await new Promise((resolve) => setTimeout(resolve, delay + jitter));
    }
  }

  throw lastError;
}
