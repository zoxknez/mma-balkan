import * as Sentry from '@sentry/nextjs';

// Frontend error handling

export enum ErrorCode {
  // Client errors
  NETWORK_ERROR = 'NETWORK_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  
  // Application errors
  COMPONENT_ERROR = 'COMPONENT_ERROR',
  API_ERROR = 'API_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly severity: ErrorSeverity;
  public readonly context: Record<string, unknown> | undefined;
  public readonly timestamp: string;

  constructor(
    message: string,
    code: ErrorCode,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    context?: Record<string, unknown>
  ) {
    super(message);
    
    this.name = this.constructor.name;
    this.code = code;
    this.severity = severity;
    this.context = context;
    this.timestamp = new Date().toISOString();

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export class NetworkError extends AppError {
  constructor(message = 'Network error', context?: Record<string, unknown>) {
    super(message, ErrorCode.NETWORK_ERROR, ErrorSeverity.HIGH, context);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized', context?: Record<string, unknown>) {
    super(message, ErrorCode.UNAUTHORIZED, ErrorSeverity.MEDIUM, context);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, ErrorCode.VALIDATION_ERROR, ErrorSeverity.LOW, context);
  }
}

export class ApiError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, ErrorCode.API_ERROR, ErrorSeverity.MEDIUM, context);
  }
}

export class ComponentError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, ErrorCode.COMPONENT_ERROR, ErrorSeverity.HIGH, context);
  }
}

// Error logger
export class ErrorLogger {
  private static sentryEnabled = false;

  static initialize() {
    // Initialize Sentry or other error tracking
    if (typeof window !== 'undefined' && process.env['NEXT_PUBLIC_SENTRY_DSN']) {
      this.sentryEnabled = true;
    }
  }

  static log(error: Error | AppError, additionalContext?: Record<string, unknown>) {
    const isAppError = error instanceof AppError;
    const isDev = process.env.NODE_ENV !== 'production';

    const logData = {
      timestamp: new Date().toISOString(),
      name: error.name,
      message: error.message,
      stack: isDev ? error.stack : undefined,
      ...(isAppError && {
        code: error.code,
        severity: error.severity,
        context: error.context,
      }),
      ...additionalContext,
    };

    // In development, log to console
    if (isDev) {
      console.group(`🚨 ${error.name}`);
      console.error('Message:', error.message);
      if (isAppError) {
        console.error('Code:', error.code);
        console.error('Severity:', error.severity);
        if (error.context) {
          console.error('Context:', error.context);
        }
      }
      if (additionalContext) {
        console.error('Additional:', additionalContext);
      }
      console.error('Stack:', error.stack);
      console.groupEnd();
    }

    // In production, send to error tracking service
    if (!isDev && this.sentryEnabled) {
      Sentry.captureException(error, {
        extra: logData,
      });
    }

    // Always log to console in production for critical errors
    if (!isDev && isAppError && error.severity === ErrorSeverity.CRITICAL) {
      console.error(JSON.stringify(logData));
    }
  }

  static logAsync(
    error: Error | AppError,
    additionalContext?: Record<string, unknown>
  ): Promise<void> {
    return Promise.resolve(this.log(error, additionalContext));
  }
}

// Error utilities
export function handleApiError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
    return new NetworkError('Unable to connect to server');
  }

  if (error instanceof Error) {
    return new ApiError(error.message);
  }

  return new ApiError('Unknown error occurred', { originalError: error });
}

export function formatErrorForUser(error: Error | AppError): string {
  if (error instanceof AppError) {
    switch (error.code) {
      case ErrorCode.NETWORK_ERROR:
        return 'Povezivanje sa serverom nije uspelo. Proverite internet konekciju.';
      case ErrorCode.UNAUTHORIZED:
        return 'Nemate autorizaciju. Molimo prijavite se ponovo.';
      case ErrorCode.FORBIDDEN:
        return 'Nemate dozvolu za ovu akciju.';
      case ErrorCode.NOT_FOUND:
        return 'Resurs nije pronađen.';
      case ErrorCode.VALIDATION_ERROR:
        return error.message;
      case ErrorCode.RATE_LIMIT_EXCEEDED:
        return 'Previše zahteva. Molimo sačekajte malo pre nego pokušate ponovo.';
      default:
        return error.message;
    }
  }

  return 'Došlo je do greške. Molimo pokušajte ponovo.';
}

// Initialize error logger on module load (client-side only)
if (typeof window !== 'undefined') {
  ErrorLogger.initialize();
}

