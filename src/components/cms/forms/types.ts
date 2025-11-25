export interface FighterFormData {
  name: string;
  record: string;
  weightClass: string;
  nationality: string;
  age: string;
  height: string;
  reach: string;
  bio: string;
  fightingStyle: string;
  gym: string;
  coach: string;
  isActive: boolean;
  image: File | string | null;
}

export interface EventFormData {
  title: string;
  date: string;
  location: string;
  venue: string;
  description: string;
  status: 'upcoming' | 'live' | 'completed' | 'cancelled';
  image: File | string | null;
  ticketPrice: string;
  ticketUrl: string;
  streamUrl: string;
}

export interface NewsFormData {
  title: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  isBreaking: boolean;
  isFeatured: boolean;
  image: File | string | null;
}

export type ContentFormData = FighterFormData | EventFormData | NewsFormData;
