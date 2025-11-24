import { z } from 'zod';

// Environment validation schema
const envSchema = z.object({
  // Server
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3003),
  
  // Database
  DATABASE_URL: z.string().url().min(1, 'DATABASE_URL is required'),
  
  // JWT
  JWT_SECRET: z.string()
    .min(32, 'JWT_SECRET must be at least 32 characters')
    .refine(
      (val) => val !== 'your-super-secret-jwt-key-change-in-production',
      'JWT_SECRET must be changed from default value'
    ),
  JWT_ACCESS_TOKEN_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_TOKEN_EXPIRES_IN: z.string().default('7d'),
  JWT_REFRESH_SECRET: z.string()
    .min(32, 'JWT_REFRESH_SECRET must be at least 32 characters'),
  
  // Security
  BCRYPT_ROUNDS: z.coerce.number().int().min(8).max(14).default(10),
  RATE_LIMIT_MAX: z.coerce.number().int().default(100),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().default(60000),
  
  // CORS
  ORIGIN: z.string().url().optional(),
  ALLOWED_ORIGINS: z.string()
    .optional()
    .transform(val => val ? val.split(',').map(o => o.trim()).filter(Boolean) : []),
  
  // Optional services
  REDIS_URL: z.string().url().optional(),
  SENTRY_DSN: z.string().url().optional(),
  PROMETHEUS_PORT: z.coerce.number().int().optional(),
  
  // Email configuration (optional)
  EMAIL_HOST: z.string().optional(),
  EMAIL_PORT: z.coerce.number().int().optional().default(587),
  EMAIL_SECURE: z.string().optional().transform(val => val === 'true'),
  EMAIL_USER: z.string().optional(),
  EMAIL_PASSWORD: z.string().optional(),
  EMAIL_FROM: z.string().email().optional().default('noreply@mmabalkan.com'),
  // Test helpers
  MOCK_PRISMA: z.enum(['true', 'false']).optional(),
}).superRefine((data, ctx) => {
  if (data.JWT_REFRESH_SECRET === data.JWT_SECRET) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'JWT_REFRESH_SECRET must differ from JWT_SECRET',
      path: ['JWT_REFRESH_SECRET'],
    });
  }

  const emailFields = [data.EMAIL_HOST, data.EMAIL_USER, data.EMAIL_PASSWORD];
  const provided = emailFields.filter(Boolean).length;
  if (provided > 0 && provided < 3) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'EMAIL_HOST, EMAIL_USER, and EMAIL_PASSWORD must all be provided together',
      path: ['EMAIL_HOST'],
    });
  }
});

type Env = z.infer<typeof envSchema>;

let cachedEnv: Env | null = null;

const parseEnv = (): Env => {
  const parsed = envSchema.parse(process.env);

  if (parsed.NODE_ENV === 'production') {
    if (!parsed.SENTRY_DSN) {
      console.warn('⚠️  SENTRY_DSN not set in production');
    }
    if (!parsed.REDIS_URL) {
      console.warn('⚠️  REDIS_URL not set in production - performance may be impacted');
    }
  }

  return parsed;
};

export const getEnv = (): Env => {
  if (!cachedEnv) {
    try {
      cachedEnv = parseEnv();
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error('❌ Invalid environment variables:');
        error.errors.forEach(err => {
          console.error(`  - ${err.path.join('.')}: ${err.message}`);
        });
        process.exit(1);
      }
      throw error;
    }
  }
  return cachedEnv;
};

export const refreshEnv = (): Env => {
  cachedEnv = null;
  return getEnv();
};

export const env = new Proxy({} as Env, {
  get: (_target, prop: keyof Env) => getEnv()[prop],
});

export type { Env };

