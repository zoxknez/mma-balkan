import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { fail } from "../lib/apiResponse";
import { AppError, ErrorLogger, formatErrorForClient, isOperationalError, NotFoundError } from "../lib/errors";
import { env } from "../lib/env";

export async function registerErrorHandler(app: FastifyInstance) {
  // Global error handler
  app.setErrorHandler(async (err: Error, req: FastifyRequest, reply: FastifyReply) => {
    // Log the error
    ErrorLogger.log(err, {
      url: req.url,
      method: req.method,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });

    // Handle operational errors
    if (err instanceof AppError) {
      const response = formatErrorForClient(err);
      return reply.code(err.statusCode).send(response);
    }

    // Handle Fastify validation errors
    if ('validation' in err && err.validation) {
      return reply.code(400).send(
        fail("Validation failed", (err as { validation: unknown }).validation)
      );
    }

    // Handle unknown errors
    const statusCode = (err as { statusCode?: number }).statusCode || 500;
    
    // In production, don't leak error details
    if (env.NODE_ENV === 'production' && !isOperationalError(err)) {
      return reply.code(statusCode).send(fail("Internal server error"));
    }

    // In development, send full error details
    return reply.code(statusCode).send(
      fail(err.message || "Internal server error", env.NODE_ENV !== 'production' ? { stack: err.stack } : undefined)
    );
  });

  // 404 handler
  app.setNotFoundHandler(async (req: FastifyRequest, reply: FastifyReply) => {
    const error = new NotFoundError(`Route ${req.method} ${req.url} not found`, {
      method: req.method,
      url: req.url,
    });

    ErrorLogger.log(error);
    const response = formatErrorForClient(error);
    return reply.code(error.statusCode).send(response);
  });

  // Handle process-level errors
  if (env.NODE_ENV === 'production') {
    process.on('unhandledRejection', (reason: unknown) => {
      const error = reason instanceof Error ? reason : new Error(String(reason));
      ErrorLogger.log(error, { type: 'unhandledRejection' });
      
      // Exit gracefully for critical errors
      if (!isOperationalError(error)) {
        console.error('💀 Critical unhandled rejection. Shutting down...');
        process.exit(1);
      }
    });

    process.on('uncaughtException', (error: Error) => {
      ErrorLogger.log(error, { type: 'uncaughtException' });
      console.error('💀 Critical uncaught exception. Shutting down...');
      process.exit(1);
    });
  }
}
