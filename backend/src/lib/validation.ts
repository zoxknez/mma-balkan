import { z } from 'zod';

// Common validation schemas
export const commonSchemas = {
  id: z.string().cuid('Invalid ID format'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().min(1, 'Search term cannot be empty').max(100, 'Search term too long'),
  date: z.coerce.date(),
  boolean: z.coerce.boolean(),
};

// Fighter validation schemas
export const fighterSchemas = {
  create: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
    nickname: z.string().max(50, 'Nickname too long').optional(),
    country: z.string().min(2, 'Country must be at least 2 characters').max(100, 'Country name too long'),
    countryCode: z.string().length(2, 'Country code must be 2 characters'),
    birthDate: z.coerce.date().optional(),
    heightCm: z.coerce.number().int().min(100).max(250).optional(),
    weightKg: z.coerce.number().int().min(40).max(200).optional(),
    weightClass: z.enum(['FLYWEIGHT', 'BANTAMWEIGHT', 'FEATHERWEIGHT', 'LIGHTWEIGHT', 'WELTERWEIGHT', 'MIDDLEWEIGHT', 'LIGHT_HEAVYWEIGHT', 'HEAVYWEIGHT']),
    reachCm: z.coerce.number().int().min(100).max(300).optional(),
    stance: z.enum(['ORTHODOX', 'SOUTHPAW', 'SWITCH']).optional(),
    wins: z.coerce.number().int().min(0).default(0),
    losses: z.coerce.number().int().min(0).default(0),
    draws: z.coerce.number().int().min(0).default(0),
    koTkoWins: z.coerce.number().int().min(0).default(0),
    submissionWins: z.coerce.number().int().min(0).default(0),
    decisionWins: z.coerce.number().int().min(0).default(0),
    isActive: z.boolean().default(true),
  }),
  
  update: z.object({
    name: z.string().min(2).max(100).optional(),
    nickname: z.string().max(50).optional(),
    country: z.string().min(2).max(100).optional(),
    countryCode: z.string().length(2).optional(),
    birthDate: z.coerce.date().optional(),
    heightCm: z.coerce.number().int().min(100).max(250).optional(),
    weightKg: z.coerce.number().int().min(40).max(200).optional(),
    weightClass: z.enum(['FLYWEIGHT', 'BANTAMWEIGHT', 'FEATHERWEIGHT', 'LIGHTWEIGHT', 'WELTERWEIGHT', 'MIDDLEWEIGHT', 'LIGHT_HEAVYWEIGHT', 'HEAVYWEIGHT']).optional(),
    reachCm: z.coerce.number().int().min(100).max(300).optional(),
    stance: z.enum(['ORTHODOX', 'SOUTHPAW', 'SWITCH']).optional(),
    wins: z.coerce.number().int().min(0).optional(),
    losses: z.coerce.number().int().min(0).optional(),
    draws: z.coerce.number().int().min(0).optional(),
    koTkoWins: z.coerce.number().int().min(0).optional(),
    submissionWins: z.coerce.number().int().min(0).optional(),
    decisionWins: z.coerce.number().int().min(0).optional(),
    isActive: z.boolean().optional(),
  }),
  
  query: z.object({
    page: commonSchemas.page,
    limit: commonSchemas.limit,
    search: z.string().max(100).optional(),
    country: z.string().max(100).optional(),
    weightClass: z.enum(['FLYWEIGHT', 'BANTAMWEIGHT', 'FEATHERWEIGHT', 'LIGHTWEIGHT', 'WELTERWEIGHT', 'MIDDLEWEIGHT', 'LIGHT_HEAVYWEIGHT', 'HEAVYWEIGHT']).optional(),
    active: commonSchemas.boolean.optional(),
  }),
};

// Event validation schemas
export const eventSchemas = {
  create: z.object({
    name: z.string().min(2, 'Event name must be at least 2 characters').max(200, 'Event name too long'),
    startAt: z.coerce.date(),
    status: z.enum(['SCHEDULED', 'UPCOMING', 'LIVE', 'COMPLETED', 'CANCELLED']).default('SCHEDULED'),
    city: z.string().min(2, 'City must be at least 2 characters').max(100, 'City name too long'),
    country: z.string().min(2, 'Country must be at least 2 characters').max(100, 'Country name too long'),
    mainEvent: z.string().max(200, 'Main event description too long').optional(),
    ticketsAvailable: z.boolean().default(false),
    fightsCount: z.coerce.number().int().min(0).default(0),
    attendees: z.coerce.number().int().min(0).optional(),
  }),
  
  update: z.object({
    name: z.string().min(2).max(200).optional(),
    startAt: z.coerce.date().optional(),
    status: z.enum(['SCHEDULED', 'UPCOMING', 'LIVE', 'COMPLETED', 'CANCELLED']).optional(),
    city: z.string().min(2).max(100).optional(),
    country: z.string().min(2).max(100).optional(),
    mainEvent: z.string().max(200).optional(),
    ticketsAvailable: z.boolean().optional(),
    fightsCount: z.coerce.number().int().min(0).optional(),
    attendees: z.coerce.number().int().min(0).optional(),
  }),
  
  query: z.object({
    page: commonSchemas.page,
    limit: commonSchemas.limit,
    city: z.string().max(100).optional(),
    country: z.string().max(100).optional(),
    status: z.enum(['SCHEDULED', 'UPCOMING', 'LIVE', 'COMPLETED', 'CANCELLED']).optional(),
    from: z.coerce.date().optional(),
    to: z.coerce.date().optional(),
  }),
};

// News validation schemas
export const newsSchemas = {
  create: z.object({
    title: z.string().min(5, 'Title must be at least 5 characters').max(200, 'Title too long'),
    slug: z.string().min(5, 'Slug must be at least 5 characters').max(200, 'Slug too long'),
    excerpt: z.string().max(500, 'Excerpt too long').optional(),
    content: z.string().min(10, 'Content must be at least 10 characters'),
    category: z.enum(['NEWS', 'INTERVIEW', 'ANALYSIS', 'ORGANIZATION', 'FIGHTER', 'EVENT']),
    authorName: z.string().min(2, 'Author name must be at least 2 characters').max(100, 'Author name too long'),
    imageUrl: z.string().url('Invalid image URL').optional(),
    featured: z.boolean().default(false),
    trending: z.boolean().default(false),
    publishAt: z.coerce.date(),
  }),
  
  update: z.object({
    title: z.string().min(5).max(200).optional(),
    slug: z.string().min(5).max(200).optional(),
    excerpt: z.string().max(500).optional(),
    content: z.string().min(10).optional(),
    category: z.enum(['NEWS', 'INTERVIEW', 'ANALYSIS', 'ORGANIZATION', 'FIGHTER', 'EVENT']).optional(),
    authorName: z.string().min(2).max(100).optional(),
    imageUrl: z.string().url().optional(),
    featured: z.boolean().optional(),
    trending: z.boolean().optional(),
    publishAt: z.coerce.date().optional(),
  }),
  
  query: z.object({
    page: commonSchemas.page,
    limit: commonSchemas.limit,
    category: z.enum(['NEWS', 'INTERVIEW', 'ANALYSIS', 'ORGANIZATION', 'FIGHTER', 'EVENT']).optional(),
    featured: commonSchemas.boolean.optional(),
    trending: commonSchemas.boolean.optional(),
    search: z.string().max(100).optional(),
  }),
};

// Club validation schemas
export const clubSchemas = {
  create: z.object({
    name: z.string().min(2, 'Club name must be at least 2 characters').max(100, 'Club name too long'),
    city: z.string().min(2, 'City must be at least 2 characters').max(100, 'City name too long'),
    country: z.string().min(2, 'Country must be at least 2 characters').max(100, 'Country name too long'),
    address: z.string().max(200, 'Address too long').optional(),
    website: z.string().url('Invalid website URL').optional(),
    phone: z.string().max(20, 'Phone number too long').optional(),
    members: z.coerce.number().int().min(0).optional(),
  }),
  
  update: z.object({
    name: z.string().min(2).max(100).optional(),
    city: z.string().min(2).max(100).optional(),
    country: z.string().min(2).max(100).optional(),
    address: z.string().max(200).optional(),
    website: z.string().url().optional(),
    phone: z.string().max(20).optional(),
    members: z.coerce.number().int().min(0).optional(),
  }),
  
  query: z.object({
    page: commonSchemas.page,
    limit: commonSchemas.limit,
    search: z.string().max(100).optional(),
    city: z.string().max(100).optional(),
    country: z.string().max(100).optional(),
  }),
};

// Fight validation schemas
export const fightSchemas = {
  create: z.object({
    eventId: commonSchemas.id,
    orderNo: z.coerce.number().int().min(1).default(1),
    section: z.enum(['MAIN', 'PRELIMS']).default('PRELIMS'),
    weightClass: z.string().max(50).optional(),
    status: z.enum(['SCHEDULED', 'COMPLETED', 'CANCELLED']).default('SCHEDULED'),
    redFighterId: commonSchemas.id,
    blueFighterId: commonSchemas.id,
    winnerFighterId: commonSchemas.id.optional(),
    method: z.enum(['KO/TKO', 'SUBMISSION', 'DECISION', 'NC']).optional(),
    round: z.coerce.number().int().min(1).max(5).optional(),
    time: z.string().regex(/^\d{1,2}:\d{2}$/, 'Time must be in MM:SS format').optional(),
  }),
  
  update: z.object({
    orderNo: z.coerce.number().int().min(1).optional(),
    section: z.enum(['MAIN', 'PRELIMS']).optional(),
    weightClass: z.string().max(50).optional(),
    status: z.enum(['SCHEDULED', 'COMPLETED', 'CANCELLED']).optional(),
    winnerFighterId: commonSchemas.id.optional(),
    method: z.enum(['KO/TKO', 'SUBMISSION', 'DECISION', 'NC']).optional(),
    round: z.coerce.number().int().min(1).max(5).optional(),
    time: z.string().regex(/^\d{1,2}:\d{2}$/).optional(),
  }),
};

// Prediction validation schemas
export const predictionSchemas = {
  create: z.object({
    fightId: commonSchemas.id,
    predictedWinnerId: commonSchemas.id,
    predictedMethod: z.enum(['KO/TKO', 'SUBMISSION', 'DECISION', 'NC']).optional(),
    predictedRound: z.coerce.number().int().min(1).max(5).optional(),
    confidence: z.coerce.number().int().min(1).max(10).default(5),
  }),
  
  update: z.object({
    predictedWinnerId: commonSchemas.id.optional(),
    predictedMethod: z.enum(['KO/TKO', 'SUBMISSION', 'DECISION', 'NC']).optional(),
    predictedRound: z.coerce.number().int().min(1).max(5).optional(),
    confidence: z.coerce.number().int().min(1).max(10).optional(),
  }),
};

// User validation schemas
export const userSchemas = {
  register: z.object({
    email: commonSchemas.email,
    username: z.string().min(3, 'Username must be at least 3 characters').max(20, 'Username too long'),
    password: commonSchemas.password,
    firstName: z.string().min(2, 'First name must be at least 2 characters').max(50, 'First name too long').optional(),
    lastName: z.string().min(2, 'Last name must be at least 2 characters').max(50, 'Last name too long').optional(),
  }),
  
  login: z.object({
    email: commonSchemas.email,
    password: z.string().min(1, 'Password is required'),
  }),
  
  update: z.object({
    firstName: z.string().min(2).max(50).optional(),
    lastName: z.string().min(2).max(50).optional(),
    username: z.string().min(3).max(20).optional(),
  }),
  
  changePassword: z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: commonSchemas.password,
  }),
};

// Validation helper functions
export function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; error: z.ZodError } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: result.error };
}

export function validateQuery<T>(schema: z.ZodSchema<T>, query: unknown): { success: true; data: T } | { success: false; error: z.ZodError } {
  return validateRequest(schema, query);
}

export function validateBody<T>(schema: z.ZodSchema<T>, body: unknown): { success: true; data: T } | { success: false; error: z.ZodError } {
  return validateRequest(schema, body);
}

export function validateParams<T>(schema: z.ZodSchema<T>, params: unknown): { success: true; data: T } | { success: false; error: z.ZodError } {
  return validateRequest(schema, params);
}
