/**
 * Shared validation utilities for frontend
 * Matches backend validation rules for consistency
 */

import { z } from 'zod';

// Password validation rules (shared with backend)
export const passwordSchema = z
  .string()
  .min(8, 'Lozinka mora imati najmanje 8 karaktera')
  .max(128, 'Lozinka može imati najviše 128 karaktera')
  .refine(
    (password) => /[A-Z]/.test(password),
    'Lozinka mora sadržati najmanje jedno veliko slovo'
  )
  .refine(
    (password) => /[a-z]/.test(password),
    'Lozinka mora sadržati najmanje jedno malo slovo'
  )
  .refine(
    (password) => /[0-9]/.test(password),
    'Lozinka mora sadržati najmanje jedan broj'
  );

// Strong password (requires special character)
export const strongPasswordSchema = passwordSchema.refine(
  (password) => /[^A-Za-z0-9]/.test(password),
  'Lozinka mora sadržati najmanje jedan specijalni karakter'
);

// Email validation
export const emailSchema = z
  .string()
  .email('Unesite validnu email adresu')
  .min(5, 'Email je prekratak')
  .max(255, 'Email je predugačak')
  .transform((email) => email.toLowerCase().trim());

// Username validation
export const usernameSchema = z
  .string()
  .min(3, 'Korisničko ime mora imati najmanje 3 karaktera')
  .max(30, 'Korisničko ime može imati najviše 30 karaktera')
  .regex(
    /^[a-zA-Z0-9_-]+$/,
    'Korisničko ime može sadržati samo slova, brojeve, _ i -'
  )
  .transform((username) => username.toLowerCase().trim());

// Name validation (first/last name)
export const nameSchema = z
  .string()
  .min(1, 'Ime je obavezno')
  .max(50, 'Ime može imati najviše 50 karaktera')
  .regex(/^[\p{L}\s'-]+$/u, 'Ime može sadržati samo slova')
  .transform((name) => name.trim());

// Phone number validation (Balkan region)
export const phoneSchema = z
  .string()
  .regex(
    /^(\+3[0-9]{2}|0)[0-9]{6,12}$/,
    'Unesite validan telefonski broj (npr. +381641234567)'
  )
  .optional();

// URL validation
export const urlSchema = z
  .string()
  .url('Unesite validnu URL adresu')
  .refine(
    (url) => url.startsWith('https://') || url.startsWith('http://'),
    'URL mora početi sa http:// ili https://'
  )
  .optional();

// Social media handle validation
export const socialHandleSchema = z
  .string()
  .max(30, 'Handle može imati najviše 30 karaktera')
  .regex(/^@?[a-zA-Z0-9_]+$/, 'Nevalidan social media handle')
  .transform((handle) => handle.replace('@', ''))
  .optional();

// Search query validation
export const searchQuerySchema = z
  .string()
  .min(2, 'Upit mora imati najmanje 2 karaktera')
  .max(100, 'Upit može imati najviše 100 karaktera')
  .transform((query) => query.trim());

// Pagination validation
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

// Date range validation
export const dateRangeSchema = z
  .object({
    from: z.coerce.date().optional(),
    to: z.coerce.date().optional(),
  })
  .refine(
    (data) => {
      if (data.from && data.to) {
        return data.from <= data.to;
      }
      return true;
    },
    {
      message: 'Datum "od" mora biti pre datuma "do"',
      path: ['from'],
    }
  );

// Form schemas
export const loginFormSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Lozinka je obavezna'),
  rememberMe: z.boolean().optional().default(false),
});

export const registerFormSchema = z
  .object({
    email: emailSchema,
    username: usernameSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    firstName: nameSchema.optional(),
    lastName: nameSchema.optional(),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: 'Morate prihvatiti uslove korišćenja',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Lozinke se ne poklapaju',
    path: ['confirmPassword'],
  });

export const changePasswordFormSchema = z
  .object({
    currentPassword: z.string().min(1, 'Trenutna lozinka je obavezna'),
    newPassword: passwordSchema,
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Lozinke se ne poklapaju',
    path: ['confirmNewPassword'],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'Nova lozinka mora biti različita od trenutne',
    path: ['newPassword'],
  });

export const forgotPasswordFormSchema = z.object({
  email: emailSchema,
});

export const resetPasswordFormSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Lozinke se ne poklapaju',
    path: ['confirmPassword'],
  });

export const profileFormSchema = z.object({
  firstName: nameSchema.optional(),
  lastName: nameSchema.optional(),
  phone: phoneSchema,
  country: z.string().max(100).optional(),
  bio: z.string().max(500, 'Biografija može imati najviše 500 karaktera').optional(),
});

// Prediction form validation
export const predictionFormSchema = z.object({
  fightId: z.string().cuid('Nevažeći ID borbe'),
  predictedWinnerId: z.string().cuid('Morate izabrati pobednika'),
  predictedMethod: z.string().optional(),
  predictedRound: z.coerce.number().int().min(1).max(5).optional(),
  confidence: z.coerce.number().int().min(1).max(10).default(5),
});

// Contact form validation
export const contactFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  subject: z
    .string()
    .min(5, 'Naslov mora imati najmanje 5 karaktera')
    .max(100, 'Naslov može imati najviše 100 karaktera'),
  message: z
    .string()
    .min(20, 'Poruka mora imati najmanje 20 karaktera')
    .max(2000, 'Poruka može imati najviše 2000 karaktera'),
});

// Utility types
export type LoginFormData = z.infer<typeof loginFormSchema>;
export type RegisterFormData = z.infer<typeof registerFormSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordFormSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordFormSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordFormSchema>;
export type ProfileFormData = z.infer<typeof profileFormSchema>;
export type PredictionFormData = z.infer<typeof predictionFormSchema>;
export type ContactFormData = z.infer<typeof contactFormSchema>;
export type PaginationParams = z.infer<typeof paginationSchema>;

// Validation helper functions
export function validateForm<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: Record<string, string> } {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors: Record<string, string> = {};
  result.error.issues.forEach((issue) => {
    const path = issue.path.join('.');
    if (!errors[path]) {
      errors[path] = issue.message;
    }
  });

  return { success: false, errors };
}

// Password strength calculator
export function calculatePasswordStrength(password: string): {
  score: number;
  feedback: string[];
  label: string;
  color: string;
} {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push('Najmanje 8 karaktera');
  }

  if (password.length >= 12) {
    score += 1;
  }

  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Dodajte veliko slovo');
  }

  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Dodajte malo slovo');
  }

  if (/[0-9]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Dodajte broj');
  }

  if (/[^A-Za-z0-9]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Dodajte specijalni karakter');
  }

  // Check for common patterns
  const commonPatterns = [
    /^123/,
    /password/i,
    /qwerty/i,
    /abc123/i,
    /(.)\1{2,}/, // repeated characters
  ];

  if (commonPatterns.some((pattern) => pattern.test(password))) {
    score = Math.max(0, score - 2);
    feedback.push('Izbegavajte uobičajene obrasce');
  }

  let label: string;
  let color: string;

  if (score <= 2) {
    label = 'Slaba';
    color = 'text-red-500';
  } else if (score <= 4) {
    label = 'Srednja';
    color = 'text-yellow-500';
  } else {
    label = 'Jaka';
    color = 'text-green-500';
  }

  return { score, feedback, label, color };
}

// Rate limit helper for form submissions
export class FormRateLimiter {
  private attempts: Map<string, number[]> = new Map();
  private readonly maxAttempts: number;
  private readonly windowMs: number;

  constructor(maxAttempts = 5, windowMs = 60000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  canSubmit(formId: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(formId) || [];
    
    // Filter out old attempts
    const recentAttempts = attempts.filter((time) => now - time < this.windowMs);
    this.attempts.set(formId, recentAttempts);

    return recentAttempts.length < this.maxAttempts;
  }

  recordAttempt(formId: string): void {
    const attempts = this.attempts.get(formId) || [];
    attempts.push(Date.now());
    this.attempts.set(formId, attempts);
  }

  getTimeUntilReset(formId: string): number {
    const attempts = this.attempts.get(formId) || [];
    if (attempts.length === 0) return 0;

    const oldestAttempt = Math.min(...attempts);
    return Math.max(0, this.windowMs - (Date.now() - oldestAttempt));
  }
}

export const formRateLimiter = new FormRateLimiter();
