import { FastifyRequest, FastifyReply } from 'fastify';
import { z, ZodSchema } from 'zod';
import { fail } from './apiResponse';

export interface ValidationOptions {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}

export function createValidationMiddleware(options: ValidationOptions) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      // Validate body
      if (options.body) {
        const bodyResult = options.body.safeParse(request.body);
        if (!bodyResult.success) {
          return reply.code(400).send(fail('Invalid request body', bodyResult.error.issues));
        }
        (request as any).validatedBody = bodyResult.data;
      }

      // Validate query
      if (options.query) {
        const queryResult = options.query.safeParse(request.query);
        if (!queryResult.success) {
          return reply.code(400).send(fail('Invalid query parameters', queryResult.error.issues));
        }
        (request as any).validatedQuery = queryResult.data;
      }

      // Validate params
      if (options.params) {
        const paramsResult = options.params.safeParse(request.params);
        if (!paramsResult.success) {
          return reply.code(400).send(fail('Invalid route parameters', paramsResult.error.issues));
        }
        (request as any).validatedParams = paramsResult.data;
      }
    } catch (error) {
      console.error('Validation middleware error:', error);
      return reply.code(500).send(fail('Validation error'));
    }
  };
}

// Type-safe request interface
export interface ValidatedRequest<TBody = unknown, TQuery = unknown, TParams = unknown> extends FastifyRequest {
  validatedBody?: TBody;
  validatedQuery?: TQuery;
  validatedParams?: TParams;
}

// Helper function to create validated route handlers
export function createValidatedRoute<TBody = unknown, TQuery = unknown, TParams = unknown>(
  options: ValidationOptions,
  handler: (request: ValidatedRequest<TBody, TQuery, TParams>, reply: FastifyReply) => Promise<unknown>
) {
  const validationMiddleware = createValidationMiddleware(options);
  
  return async (request: FastifyRequest, reply: FastifyReply) => {
    // Run validation middleware first
    const validationResult = await validationMiddleware(request, reply);
    if (validationResult) {
      return validationResult; // Validation failed, response already sent
    }
    
    // Run the actual handler
    return handler(request as ValidatedRequest<TBody, TQuery, TParams>, reply);
  };
}

// Common validation patterns
export const commonValidations = {
  idParam: z.object({
    id: z.string().cuid('Invalid ID format'),
  }),
  
  paginationQuery: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
  }),
  
  searchQuery: z.object({
    search: z.string().min(1).max(100).optional(),
  }),
  
  dateRangeQuery: z.object({
    from: z.coerce.date().optional(),
    to: z.coerce.date().optional(),
  }),
};

// Error response formatter
export function formatValidationError(error: z.ZodError) {
  return {
    success: false,
    error: 'Validation failed',
    issues: error.issues.map(issue => ({
      field: issue.path.join('.'),
      message: issue.message,
      code: issue.code,
    })),
  };
}

// Sanitization helpers
export function sanitizeString(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

export function sanitizeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

export function sanitizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    // Only allow http and https protocols
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      throw new Error('Invalid protocol');
    }
    return parsed.toString();
  } catch {
    throw new Error('Invalid URL format');
  }
}
