import { FastifyRequest } from 'fastify';
import { randomUUID } from 'crypto';
import { env } from './env';

// Request ID for tracing
export function generateRequestId(): string {
  return randomUUID();
}

// Add request ID to request
export function addRequestId(request: FastifyRequest): string {
  const requestId = 
    (request.headers['x-request-id'] as string) || 
    generateRequestId();

  // Store in request object
  (request as FastifyRequest & { id: string }).id = requestId;

  return requestId;
}

// Get request ID from request
export function getRequestId(request: FastifyRequest): string {
  return (request as FastifyRequest & { id?: string }).id || 'unknown';
}

// Request context for logging
export interface RequestContext {
  requestId: string;
  method: string;
  url: string;
  ip: string;
  userAgent: string;
  userId?: string;
  startTime: number;
}

// Create request context
export function createRequestContext(request: FastifyRequest): RequestContext {
  const authRequest = request as FastifyRequest & { user?: { id: string } };

  return {
    requestId: getRequestId(request),
    method: request.method,
    url: request.url,
    ip: request.ip,
    userAgent: request.headers['user-agent'] || 'unknown',
    userId: authRequest.user?.id,
    startTime: Date.now(),
  };
}

// Log request completion
export function logRequestCompletion(
  context: RequestContext,
  statusCode: number
) {
  const duration = Date.now() - context.startTime;

  const logData = {
    requestId: context.requestId,
    method: context.method,
    url: context.url,
    statusCode,
    duration,
    userId: context.userId,
  };

  if (duration > 1000) {
    console.warn('🐌 Slow request:', logData);
  }

  if (statusCode >= 500) {
    console.error('❌ Server error:', logData);
  }

  if (env.NODE_ENV !== 'production') {
    console.log(`${context.method} ${context.url} - ${statusCode} (${duration}ms)`);
  }
}

