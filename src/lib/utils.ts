import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('sr-RS', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function formatRecord(wins: number, losses: number, draws: number = 0): string {
  return `${wins}-${losses}-${draws}`;
}

export function calculateAge(birthDate: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function getCountryFlag(countryCode: string): string {
  const flags: Record<string, string> = {
    'RS': '🇷🇸', // Serbia
    'HR': '🇭🇷', // Croatia
    'BA': '🇧🇦', // Bosnia and Herzegovina
    'ME': '🇲🇪', // Montenegro
    'SI': '🇸🇮', // Slovenia
    'MK': '🇲🇰', // North Macedonia
    'AL': '🇦🇱', // Albania
    'XK': '🇽🇰', // Kosovo
  };
  
  return flags[countryCode] || '🏳️';
}

export function formatHeight(heightCm: number): string {
  const feet = Math.floor(heightCm / 30.48);
  const inches = Math.round((heightCm / 30.48 - feet) * 12);
  return `${heightCm}cm (${feet}'${inches}")`;
}

export function formatWeight(weightKg: number): string {
  const pounds = Math.round(weightKg * 2.20462);
  return `${weightKg}kg (${pounds}lbs)`;
}