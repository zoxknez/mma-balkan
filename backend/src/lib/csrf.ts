import { FastifyRequest, FastifyReply } from 'fastify';
import crypto from 'crypto';

// CSRF Token Storage (in production, use Redis)
const csrfTokens = new Map<string, { token: string; expires: number }>();

// Generate CSRF token
export function generateCSRFToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Validate CSRF token
export function validateCSRFToken(sessionId: string, token: string): boolean {
  const stored = csrfTokens.get(sessionId);
  
  if (!stored) {
    return false;
  }
  
  // Check if token expired (15 minutes)
  if (Date.now() > stored.expires) {
    csrfTokens.delete(sessionId);
    return false;
  }
  
  return stored.token === token;
}

// Store CSRF token
export function storeCSRFToken(sessionId: string, token: string): void {
  csrfTokens.set(sessionId, {
    token,
    expires: Date.now() + 15 * 60 * 1000, // 15 minutes
  });
}

// Clean expired tokens periodically
setInterval(() => {
  const now = Date.now();
  for (const [sessionId, data] of csrfTokens.entries()) {
    if (now > data.expires) {
      csrfTokens.delete(sessionId);
    }
  }
}, 5 * 60 * 1000); // Every 5 minutes

// CSRF Protection Middleware
export async function csrfProtection(request: FastifyRequest, reply: FastifyReply) {
  // Skip CSRF for GET, HEAD, OPTIONS
  if (['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
    return;
  }
  
  // Skip CSRF for API endpoints using Bearer tokens (stateless)
  const authHeader = request.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return;
  }
  
  // Get CSRF token from header or body
  const csrfToken = 
    request.headers['x-csrf-token'] as string ||
    request.headers['x-xsrf-token'] as string ||
    (request.body as { _csrf?: string })?._csrf;
  
  // Get session ID (from cookie or generate)
  const sessionId = (request.headers['x-session-id'] as string) || request.ip;
  
  if (!csrfToken || !validateCSRFToken(sessionId, csrfToken)) {
    return reply.code(403).send({
      success: false,
      error: 'Invalid or missing CSRF token',
    });
  }
}

// Generate and send CSRF token
export async function getCSRFToken(request: FastifyRequest, reply: FastifyReply) {
  const sessionId = (request.headers['x-session-id'] as string) || request.ip;
  const token = generateCSRFToken();
  
  storeCSRFToken(sessionId, token);
  
  return reply.send({
    success: true,
    data: {
      csrfToken: token,
      sessionId,
    },
  });
}

