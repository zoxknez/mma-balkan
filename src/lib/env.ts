import { z } from 'zod';

// Client-side environment validation
const clientEnvSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url().optional().default(''),
  NEXT_PUBLIC_SOCKET_URL: z.string().url().optional().default(''),
  NEXT_PUBLIC_SITE_URL: z.string().url().optional().default('http://localhost:3002'),
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
  NEXT_PUBLIC_APP_VERSION: z.string().optional().default('1.0.0'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

// Server-side environment validation (includes all client vars)
const serverEnvSchema = clientEnvSchema.extend({
  // Server-only vars
  NEXTAUTH_URL: z.string().url().optional(),
  NEXTAUTH_SECRET: z.string().min(32).optional(),
  
  // AI/ML
  OPENAI_API_KEY: z.string().optional(),
  
  // OAuth (optional)
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GITHUB_ID: z.string().optional(),
  GITHUB_SECRET: z.string().optional(),
});

// Validate environment
function validateEnv() {
  const isServer = typeof window === 'undefined';
  
  try {
    if (isServer) {
      // Server-side: validate all env vars
      const env = serverEnvSchema.parse(process.env);
      
      // Additional production checks
      if (env.NODE_ENV === 'production') {
        const siteUrl = env.NEXT_PUBLIC_SITE_URL;
        if (!siteUrl.startsWith('https://') && !siteUrl.includes('localhost')) {
          console.error('❌ NEXT_PUBLIC_SITE_URL must use HTTPS in production');
          process.exit(1);
        }
        
        if (!env.NEXT_PUBLIC_SENTRY_DSN) {
          console.warn('⚠️  NEXT_PUBLIC_SENTRY_DSN not set in production');
        }
      }
      
      return env;
    } else {
      // Client-side: only validate public vars
      const clientEnv: Record<string, string | undefined> = {};
      
      // Extract NEXT_PUBLIC_ vars from window
      if (typeof window !== 'undefined') {
        Object.keys(process.env).forEach(key => {
          if (key.startsWith('NEXT_PUBLIC_')) {
            clientEnv[key] = process.env[key];
          }
        });
        clientEnv['NODE_ENV'] = process.env['NODE_ENV'];
      }
      
      return clientEnvSchema.parse(clientEnv);
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Invalid environment variables:');
      error.errors.forEach(err => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`);
      });
      
      if (isServer) {
        process.exit(1);
      }
    }
    throw error;
  }
}

// Export validated environment
export const env = validateEnv();

// Type-safe environment variables
export type ClientEnv = z.infer<typeof clientEnvSchema>;
export type ServerEnv = z.infer<typeof serverEnvSchema>;

// Helper to check if we're on server
export const isServer = typeof window === 'undefined';

// Helper to get public env vars safely
export function getPublicEnv<K extends keyof ClientEnv>(key: K): ClientEnv[K] {
  return env[key];
}

