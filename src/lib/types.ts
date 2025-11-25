export interface Fighter {
  id: string;
  name: string;
  nickname?: string;
  country: string;
  countryCode: string;
  birthDate?: Date;
  heightCm?: number; // Synced with Prisma
  weightKg?: number; // Synced with Prisma
  weightClass: string; // Changed from enum to string to match Prisma
  reachCm?: number; // Synced with Prisma
  stance?: string; // Changed from enum to string to match Prisma
  wins: number;
  losses: number;
  draws: number;
  koTkoWins: number;
  submissionWins: number;
  decisionWins: number;
  isActive: boolean;
  deletedAt?: Date; // Added for soft delete
  lastFight?: Date;
  createdAt: Date;
  updatedAt: Date;
  // Extended properties not in Prisma
  club?: Club;
  profileImage?: string;
  upcomingFight?: Event;
  socialMedia?: SocialMedia;
  biography?: string;
  fightingStyle?: string[];
  ranking?: {
    position: number;
    organization: string;
    weightClass: string;
  };
}

export interface Event {
  id: string;
  name: string;
  slug?: string;
  startAt: Date; // Synced with Prisma
  status: string; // Changed from enum to string
  city: string; // Synced with Prisma
  country: string; // Synced with Prisma
  mainEvent?: string; // Synced with Prisma
  ticketsAvailable: boolean; // Synced with Prisma
  fightsCount: number; // Synced with Prisma
  attendees?: number; // Synced with Prisma
  deletedAt?: Date; // Added for soft delete
  createdAt: Date;
  updatedAt: Date;
  fights?: Fight[]; // Prisma relation
  // Extended properties not in Prisma
  organization?: Organization;
  venue?: string;
  poster?: string;
  ticketUrl?: string;
  streamingInfo?: StreamingInfo;
  weightInResults?: WeightInResult[];
}

export interface Fight {
  id: string;
  eventId: string;
  orderNo: number; // Synced with Prisma
  section: string; // MAIN | PRELIMS - Synced with Prisma
  weightClass?: string; // Synced with Prisma
  status: string; // SCHEDULED | COMPLETED | CANCELLED - Synced with Prisma
  redFighterId: string; // Synced with Prisma
  blueFighterId: string; // Synced with Prisma
  winnerFighterId?: string; // Synced with Prisma
  method?: string; // KO/TKO | SUBMISSION | DECISION | NC - Synced with Prisma
  round?: number;
  time?: string; // e.g., 3:12
  deletedAt?: Date; // Added for soft delete
  createdAt: Date;
  updatedAt: Date;
  // Relations
  event?: Event;
  redFighter?: Fighter;
  blueFighter?: Fighter;
  predictions?: Prediction[];
  // Extended properties
  bonuses?: FightBonus[];
}

export interface FightResult {
  winner: Fighter;
  loser: Fighter;
  method: FinishMethod;
  round: number;
  time: string;
  scorecards?: Scorecard[];
}

export interface Organization {
  id: string;
  name: string;
  shortName: string;
  country: string;
  founded: Date;
  logo?: string;
  website?: string;
  description?: string;
  isActive: boolean;
  weightClasses: WeightClass[];
}

export interface Club {
  id: string;
  name: string;
  city: string; // Synced with Prisma
  country: string; // Synced with Prisma
  address?: string; // Synced with Prisma
  website?: string; // Synced with Prisma
  phone?: string; // Synced with Prisma
  members?: number; // Synced with Prisma
  deletedAt?: Date; // Added for soft delete
  createdAt: Date;
  updatedAt: Date;
  // Relations
  followedBy?: unknown[]; // FollowedClub[]
  // Extended properties not in Prisma
  coordinates?: {
    lat: number;
    lng: number;
  };
  disciplines?: MartialArt[];
  trainers?: Trainer[];
  fighters?: Fighter[];
  contactInfo?: {
    email?: string;
  };
  socialMedia?: SocialMedia;
  schedules?: TrainingSchedule[];
  facilities?: string[];
  pricing?: PricingPlan[];
  images?: string[];
  established?: Date;
  description?: string;
}

export interface Trainer {
  id: string;
  name: string;
  specialization: MartialArt[];
  experience: number; // years
  achievements?: string[];
  profileImage?: string;
  biography?: string;
}

export interface TrainingSchedule {
  day: string;
  discipline: MartialArt;
  startTime: string;
  endTime: string;
  level: SkillLevel;
  trainer: Trainer;
}

export interface PricingPlan {
  name: string;
  price: number;
  currency: string;
  period: string; // month, year, session
  includes: string[];
}

export interface News {
  id: string;
  title: string;
  slug: string; // Synced with Prisma
  excerpt?: string; // Synced with Prisma
  content: string;
  category: string; // Changed from enum to string
  authorName: string; // Synced with Prisma
  imageUrl?: string; // Synced with Prisma
  featured: boolean; // Synced with Prisma
  trending: boolean; // Synced with Prisma
  views: number;
  likes: number; // Synced with Prisma
  publishAt: Date; // Synced with Prisma
  deletedAt?: Date; // Added for soft delete
  createdAt: Date;
  updatedAt: Date;
  // Extended properties not in Prisma
  tags?: string[];
  relatedFighters?: Fighter[];
  relatedEvents?: Event[];
  relatedClubs?: Club[];
  source?: string;
}

export interface Prediction {
  id: string;
  userId: string;
  fightId: string; // Synced with Prisma
  predictedWinnerId: string; // Synced with Prisma
  predictedMethod?: string; // Synced with Prisma
  predictedRound?: number; // Synced with Prisma
  confidence: number; // 1-10 - Synced with Prisma
  points: number; // Synced with Prisma
  isCorrect?: boolean; // Synced with Prisma
  createdAt: Date;
  updatedAt: Date;
  // Relations
  user?: UserProfile;
  fight?: Fight;
}

// Backend User model (synced with Prisma)
export interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  role: 'USER' | 'MODERATOR' | 'ADMIN';
  isActive: boolean;
  deletedAt?: Date;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Frontend UserProfile (extended)
export interface UserProfile {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: 'USER' | 'MODERATOR' | 'ADMIN';
  avatar?: string;
  country?: string;
  favoriteOrganization?: Organization;
  followedFighters?: Fighter[];
  followedClubs?: Club[];
  watchlist?: Event[];
  predictions?: Prediction[];
  stats?: {
    correctPredictions: number;
    totalPredictions: number;
    points: number;
    rank: number;
  };
  preferences?: {
    language: Language;
    script: Script;
    theme: Theme;
    notifications: NotificationSettings;
  };
  joinedAt: Date;
  lastLogin?: Date;
}

// Enums
export enum WeightClass {
  STRAWWEIGHT = 'Strawweight',
  FLYWEIGHT = 'Flyweight',
  BANTAMWEIGHT = 'Bantamweight',
  FEATHERWEIGHT = 'Featherweight',
  LIGHTWEIGHT = 'Lightweight',
  WELTERWEIGHT = 'Welterweight',
  MIDDLEWEIGHT = 'Middleweight',
  LIGHT_HEAVYWEIGHT = 'Light Heavyweight',
  HEAVYWEIGHT = 'Heavyweight',
  SUPER_HEAVYWEIGHT = 'Super Heavyweight',
}

export enum FightingStance {
  ORTHODOX = 'Orthodox',
  SOUTHPAW = 'Southpaw',
  SWITCH = 'Switch',
}

export enum FinishMethod {
  KO = 'KO',
  TKO = 'TKO',
  SUBMISSION = 'Submission',
  DECISION = 'Decision',
  SPLIT_DECISION = 'Split Decision',
  MAJORITY_DECISION = 'Majority Decision',
  DRAW = 'Draw',
  NO_CONTEST = 'No Contest',
  DQ = 'Disqualification',
}

export enum FightBonus {
  PERFORMANCE = 'Performance of the Night',
  FIGHT = 'Fight of the Night',
  SUBMISSION = 'Submission of the Night',
  KO = 'KO of the Night',
}

export enum EventStatus {
  UPCOMING = 'Upcoming',
  LIVE = 'Live',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
  POSTPONED = 'Postponed',
}

export enum MartialArt {
  MMA = 'Mixed Martial Arts',
  BOXING = 'Boxing',
  KICKBOXING = 'Kickboxing',
  MUAY_THAI = 'Muay Thai',
  BJJ = 'Brazilian Jiu-Jitsu',
  WRESTLING = 'Wrestling',
  JUDO = 'Judo',
  KARATE = 'Karate',
  TAEKWONDO = 'Taekwondo',
}

export enum SkillLevel {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced',
  PROFESSIONAL = 'Professional',
}

export enum NewsCategory {
  FIGHT_RESULTS = 'Fight Results',
  UPCOMING_FIGHTS = 'Upcoming Fights',
  FIGHTER_NEWS = 'Fighter News',
  ORGANIZATION_NEWS = 'Organization News',
  INJURIES = 'Injuries',
  RANKINGS = 'Rankings',
  INTERVIEWS = 'Interviews',
  ANALYSIS = 'Analysis',
  TECHNIQUE = 'Technique',
}

export enum Language {
  SERBIAN = 'sr',
  CROATIAN = 'hr',
  BOSNIAN = 'bs',
  MONTENEGRIN = 'cnr',
  SLOVENIAN = 'sl',
  MACEDONIAN = 'mk',
  ALBANIAN = 'sq',
  ENGLISH = 'en',
}

export enum Script {
  LATIN = 'latin',
  CYRILLIC = 'cyrillic',
}

export enum Theme {
  DARK = 'dark',
  LIGHT = 'light',
  ULTRA_PREMIUM = 'ultra-premium',
}

// Supporting interfaces
export interface SocialMedia {
  instagram?: string;
  twitter?: string;
  facebook?: string;
  youtube?: string;
  tiktok?: string;
}

export interface StreamingInfo {
  platform: string;
  url?: string;
  isPpv: boolean;
  price?: number;
  currency?: string;
}

export interface WeightInResult {
  fighter: Fighter;
  weight: number;
  madeWeight: boolean;
  penalty?: number;
}

export interface Scorecard {
  judge: string;
  scores: number[]; // scores per round
  total: string; // e.g., "29-28"
}

export interface NotificationSettings {
  fightResults: boolean;
  upcomingFights: boolean;
  fighterNews: boolean;
  weightIns: boolean;
  predictions: boolean;
  email: boolean;
  push: boolean;
}