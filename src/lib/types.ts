export interface Fighter {
  id: string;
  name: string;
  nickname?: string;
  country: string;
  countryCode: string;
  birthDate: Date;
  height: number; // cm
  weight: number; // kg
  weightClass: WeightClass;
  reach?: number; // cm
  stance: FightingStance;
  wins: number;
  losses: number;
  draws: number;
  koTkoWins: number;
  submissionWins: number;
  decisionWins: number;
  club?: Club;
  profileImage?: string;
  isActive: boolean;
  lastFight?: Date;
  upcomingFight?: Event;
  socialMedia?: SocialMedia;
  biography?: string;
  fightingStyle?: string[];
  ranking?: {
    position: number;
    organization: string;
    weightClass: WeightClass;
  };
}

export interface Event {
  id: string;
  name: string;
  organization: Organization;
  date: Date;
  location: {
    venue: string;
    city: string;
    country: string;
    countryCode: string;
  };
  fightCard: Fight[];
  poster?: string;
  status: EventStatus;
  ticketUrl?: string;
  streamingInfo?: StreamingInfo;
  weightInResults?: WeightInResult[];
}

export interface Fight {
  id: string;
  fighter1: Fighter;
  fighter2: Fighter;
  weightClass: WeightClass;
  rounds: number;
  isMainEvent: boolean;
  isTitleFight: boolean;
  title?: string;
  result?: FightResult;
  method?: FinishMethod;
  round?: number;
  time?: string;
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
  location: {
    address: string;
    city: string;
    country: string;
    countryCode: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  disciplines: MartialArt[];
  trainers: Trainer[];
  fighters: Fighter[];
  contactInfo: {
    phone?: string;
    email?: string;
    website?: string;
  };
  socialMedia?: SocialMedia;
  schedules?: TrainingSchedule[];
  facilities?: string[];
  pricing?: PricingPlan[];
  images?: string[];
  established?: Date;
  description?: string;
  isVerified: boolean;
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
  summary: string;
  content: string;
  author: string;
  publishedAt: Date;
  updatedAt?: Date;
  category: NewsCategory;
  tags: string[];
  featuredImage?: string;
  relatedFighters?: Fighter[];
  relatedEvents?: Event[];
  relatedClubs?: Club[];
  isVerified: boolean;
  source?: string;
  views: number;
}

export interface Prediction {
  id: string;
  userId: string;
  fight: Fight;
  predictedWinner: Fighter;
  method?: FinishMethod;
  round?: number;
  confidence: number; // 1-10
  createdAt: Date;
  points?: number;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  country?: string;
  favoriteOrganization?: Organization;
  followedFighters: Fighter[];
  followedClubs: Club[];
  watchlist: Event[];
  predictions: Prediction[];
  stats: {
    correctPredictions: number;
    totalPredictions: number;
    points: number;
    rank: number;
  };
  preferences: {
    language: Language;
    script: Script;
    theme: Theme;
    notifications: NotificationSettings;
  };
  joinedAt: Date;
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