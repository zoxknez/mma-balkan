import { env } from './env';

// Error types
export enum ErrorCode {
  // Client errors 4xx
  BAD_REQUEST = 'BAD_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  
  // Server errors 5xx
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  DATABASE_ERROR = 'DATABASE_ERROR',
}

export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

// Custom application error
export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly severity: ErrorSeverity;
  public readonly isOperational: boolean;
  public readonly context?: Record<string, unknown>;

  constructor(
    message: string,
    code: ErrorCode,
    statusCode: number,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    isOperational = true,
    context?: Record<string, unknown>
  ) {
    super(message);
    
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.severity = severity;
    this.isOperational = isOperational;
    if (context) {
      this.context = context;
    }

    Error.captureStackTrace(this, this.constructor);
  }
}

// Specific error classes
export class ValidationError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(
      message,
      ErrorCode.VALIDATION_ERROR,
      400,
      ErrorSeverity.LOW,
      true,
      context
    );
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized', context?: Record<string, unknown>) {
    super(
      message,
      ErrorCode.UNAUTHORIZED,
      401,
      ErrorSeverity.MEDIUM,
      true,
      context
    );
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden', context?: Record<string, unknown>) {
    super(
      message,
      ErrorCode.FORBIDDEN,
      403,
      ErrorSeverity.MEDIUM,
      true,
      context
    );
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Not found', context?: Record<string, unknown>) {
    super(
      message,
      ErrorCode.NOT_FOUND,
      404,
      ErrorSeverity.LOW,
      true,
      context
    );
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflict', context?: Record<string, unknown>) {
    super(
      message,
      ErrorCode.CONFLICT,
      409,
      ErrorSeverity.MEDIUM,
      true,
      context
    );
  }
}

export class RateLimitError extends AppError {
  constructor(message = 'Rate limit exceeded', context?: Record<string, unknown>) {
    super(
      message,
      ErrorCode.RATE_LIMIT_EXCEEDED,
      429,
      ErrorSeverity.LOW,
      true,
      context
    );
  }
}

export class DatabaseError extends AppError {
  constructor(message = 'Database error', context?: Record<string, unknown>) {
    super(
      message,
      ErrorCode.DATABASE_ERROR,
      500,
      ErrorSeverity.HIGH,
      true,
      context
    );
  }
}

export class InternalError extends AppError {
  constructor(message = 'Internal server error', context?: Record<string, unknown>) {
    super(
      message,
      ErrorCode.INTERNAL_ERROR,
      500,
      ErrorSeverity.CRITICAL,
      false,
      context
    );
  }
}

// Error logger
export class ErrorLogger {
  static log(error: Error | AppError, additionalContext?: Record<string, unknown>) {
    const timestamp = new Date().toISOString();
    const isAppError = error instanceof AppError;

    const logData = {
      timestamp,
      name: error.name,
      message: error.message,
      stack: env.NODE_ENV !== 'production' ? error.stack : undefined,
      ...(isAppError && {
        code: error.code,
        statusCode: error.statusCode,
        severity: error.severity,
        isOperational: error.isOperational,
        context: error.context,
      }),
      ...additionalContext,
    };

    // In production, send to monitoring service (e.g., Sentry)
    if (env.NODE_ENV === 'production') {
      // TODO: Integrate with Sentry or similar service
      if (isAppError && error.severity === ErrorSeverity.CRITICAL) {
        console.error(JSON.stringify({ level: 'error', ...logData }));
      } else if (isAppError && error.severity === ErrorSeverity.HIGH) {
        console.error(JSON.stringify({ level: 'error', ...logData }));
      } else {
        console.warn(JSON.stringify({ level: 'warn', ...logData }));
      }
    } else {
      // Development: Pretty print
      console.error('\n🚨 Error:', {
        ...logData,
        stack: error.stack,
      });
    }
  }

  static async logAsync(
    error: Error | AppError,
    additionalContext?: Record<string, unknown>
  ): Promise<void> {
    return Promise.resolve(this.log(error, additionalContext));
  }
}

// Error utilities
export function isOperationalError(error: Error): boolean {
  if (error instanceof AppError) {
    return error.isOperational;
  }
  return false;
}

export function formatErrorForClient(error: Error | AppError): {
  success: false;
  error: string;
  code?: string;
  details?: unknown;
} {
  const isAppError = error instanceof AppError;
  const isProd = env.NODE_ENV === 'production';

  const response: { success: false; error: string; code?: string; details?: unknown } = {
    success: false,
    error: isProd && !isAppError
      ? 'Internal server error'
      : error.message,
  };

  if (isAppError) {
    response.code = error.code;
    if (!isProd && error.context) {
      response.details = error.context;
    }
  }

  return response;
}

