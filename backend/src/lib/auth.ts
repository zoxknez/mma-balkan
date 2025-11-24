import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { FastifyRequest, FastifyReply } from 'fastify';
import { env } from './env.js';

export interface UserPayload {
  id: string;
  email: string;
  role: 'user' | 'admin' | 'moderator';
  type?: 'access' | 'refresh';
}

export interface AuthRequest extends FastifyRequest {
  user: UserPayload;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// Hash password with configurable rounds
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, env.BCRYPT_ROUNDS);
}

// Verify password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Generate token pair (access + refresh)
export function generateTokens(payload: Omit<UserPayload, 'type'>): TokenPair {
  const accessPayload: UserPayload = { ...payload, type: 'access' };
  const refreshPayload: UserPayload = { ...payload, type: 'refresh' };
  
  const accessToken = jwt.sign(accessPayload, env.JWT_SECRET, {
    expiresIn: env.JWT_ACCESS_TOKEN_EXPIRES_IN as any,
  });
  
  const refreshToken = jwt.sign(refreshPayload, env.JWT_REFRESH_SECRET!, {
    expiresIn: env.JWT_REFRESH_TOKEN_EXPIRES_IN as any,
  });
  
  // Calculate expiration in seconds
  const expiresIn = parseExpiration(env.JWT_ACCESS_TOKEN_EXPIRES_IN);
  
  return { accessToken, refreshToken, expiresIn };
}

// Legacy function for backward compatibility
export function generateToken(payload: Omit<UserPayload, 'type'>): string {
  return generateTokens(payload).accessToken;
}

// Verify access token
export function verifyAccessToken(token: string): UserPayload | null {
  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as UserPayload;
    if (payload.type !== 'access') {
      return null;
    }
    return payload;
  } catch (error) {
    return null;
  }
}

// Verify refresh token
export function verifyRefreshToken(token: string): UserPayload | null {
  try {
    const payload = jwt.verify(token, env.JWT_REFRESH_SECRET!) as UserPayload;
    if (payload.type !== 'refresh') {
      return null;
    }
    return payload;
  } catch (error) {
    return null;
  }
}

// Legacy function for backward compatibility
export function verifyToken(token: string): UserPayload | null {
  return verifyAccessToken(token);
}

// Helper to parse JWT expiration time to seconds
function parseExpiration(exp: string): number {
  const match = exp.match(/^(\d+)([smhd])$/);
  if (!match) return 900; // default 15 minutes
  
  const value = parseInt(match[1]!);
  const unit = match[2]!;
  
  const multipliers: Record<string, number> = {
    s: 1,
    m: 60,
    h: 3600,
    d: 86400,
  };
  
  return value * (multipliers[unit] || 60);
}

// Auth middleware
export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  const authRequest = request as AuthRequest;
  try {
    const authHeader = authRequest.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logAuthFailure(authRequest, 'Missing or invalid authorization header');
      return reply.code(401).send({ 
        success: false, 
        error: 'Missing or invalid authorization header' 
      });
    }

    const token = authHeader.substring(7);
    const payload = verifyAccessToken(token);

    if (!payload) {
      logAuthFailure(authRequest, 'Invalid or expired token');
      return reply.code(401).send({ 
        success: false, 
        error: 'Invalid or expired token' 
      });
    }

    authRequest.user = payload;
  } catch (error) {
    logAuthFailure(authRequest, 'Authentication failed', error);
    return reply.code(401).send({ 
      success: false, 
      error: 'Authentication failed' 
    });
  }
}

// Log authentication failures for security monitoring
function logAuthFailure(request: AuthRequest, reason: string, error?: unknown) {
  const logData = {
    timestamp: new Date().toISOString(),
    ip: request.ip,
    userAgent: request.headers['user-agent'],
    path: request.url,
    reason,
  };
  
  if (env.NODE_ENV !== 'production') {
    console.warn('🔒 Auth failure:', logData, error);
  } else {
    // In production, use structured logging
    console.warn(JSON.stringify({ type: 'auth_failure', ...logData }));
  }
}

// Role-based authorization
export function requireRole(roles: string[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const authRequest = request as AuthRequest;
    if (!authRequest.user) {
      return reply.code(401).send({ 
        success: false, 
        error: 'Authentication required' 
      });
    }

    if (!roles.includes(authRequest.user.role)) {
      return reply.code(403).send({ 
        success: false, 
        error: 'Insufficient permissions' 
      });
    }
  };
}

// Rate limiting configuration
export const rateLimitConfig = {
  global: {
    max: env.RATE_LIMIT_MAX,
    timeWindow: env.RATE_LIMIT_WINDOW_MS,
    errorResponseBuilder: (request: FastifyRequest, context: { after: string }) => ({
      success: false,
      error: 'Rate limit exceeded. Please try again later.',
      retryAfter: context.after
    }),
    addHeaders: {
      'x-ratelimit-limit': true,
      'x-ratelimit-remaining': true,
      'x-ratelimit-reset': true,
    }
  },
  auth: {
    max: 5, // login attempts
    timeWindow: '15 minutes',
    keyGenerator: (request: FastifyRequest) => {
      // Combine IP and user agent for more granular rate limiting
      return `auth:${request.ip}:${request.headers['user-agent'] || 'unknown'}`;
    },
    errorResponseBuilder: (request: FastifyRequest, context: { after: string }) => {
      logAuthFailure(request as AuthRequest, `Rate limit exceeded - too many login attempts`);
      return {
        success: false,
        error: 'Too many login attempts. Please try again later.',
        retryAfter: context.after
      };
    },
    addHeaders: {
      'x-ratelimit-limit': true,
      'x-ratelimit-remaining': true,
      'x-ratelimit-reset': true,
    }
  },
  api: {
    max: 50, // API calls per minute
    timeWindow: '1 minute',
    keyGenerator: (request: FastifyRequest) => {
      // Use user ID if authenticated, otherwise IP
      const authRequest = request as AuthRequest;
      return authRequest.user 
        ? `api:user:${authRequest.user.id}` 
        : `api:ip:${request.ip}`;
    },
    addHeaders: {
      'x-ratelimit-limit': true,
      'x-ratelimit-remaining': true,
      'x-ratelimit-reset': true,
    }
  },
  strict: {
    max: 10, // For sensitive endpoints
    timeWindow: '1 minute',
    keyGenerator: (request: FastifyRequest) => {
      const authRequest = request as AuthRequest;
      return authRequest.user 
        ? `strict:user:${authRequest.user.id}` 
        : `strict:ip:${request.ip}`;
    },
    addHeaders: {
      'x-ratelimit-limit': true,
      'x-ratelimit-remaining': true,
      'x-ratelimit-reset': true,
    }
  }
};
