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

// UI pretty-print helpers (Serbian)
export function prettyWeightClass(value?: string | null): string {
  const v = (value || '').toLowerCase();
  switch (v) {
    case 'strawweight':
      return 'Slamnata';
    case 'flyweight':
      return 'Muva';
    case 'bantamweight':
      return 'Bantam';
    case 'featherweight':
      return 'Perolaka';
    case 'lightweight':
      return 'Laka';
    case 'welterweight':
      return 'Velter';
    case 'middleweight':
      return 'Srednja';
    case 'light heavyweight':
      return 'Poluteška';
    case 'heavyweight':
      return 'Teška';
    case 'super heavyweight':
      return 'Superteška';
    default:
      return value ?? '—';
  }
}

export function prettyStance(value?: string | null): string {
  const v = (value || '').toLowerCase();
  switch (v) {
    case 'orthodox':
      return 'Ortodoksni gard';
    case 'southpaw':
      return 'Levoruki gard';
    case 'switch':
      return 'Menjajući gard';
    default:
      return value ?? '—';
  }
}

export function prettyFinishMethod(value?: string | null): string {
  const v = (value || '').toLowerCase();
  if (!v) return 'Ishod';
  if (v.includes('ko') && !v.includes('tko')) return 'KO';
  if (v.includes('tko')) return 'TKO';
  if (v.includes('sub')) return 'Predaja';
  if (v.includes('submission')) return 'Predaja';
  if (v.includes('split')) return 'Podeljena odluka';
  if (v.includes('majority')) return 'Većinska odluka';
  if (v.includes('decision') || v === 'dec') return 'Odluka';
  if (v.includes('draw')) return 'Nerešeno';
  if (v.includes('no contest') || v.includes('nc')) return 'Bez pobednika';
  if (v.includes('dq') || v.includes('disqualification')) return 'Diskvalifikacija';
  return value ?? 'Ishod';
}

export function prettyEventStatus(value?: string | null): string {
  const v = (value || '').toLowerCase();
  switch (v) {
    case 'upcoming':
      return 'Predstojeći';
    case 'live':
      return 'Uživo';
    case 'completed':
      return 'Završeno';
    case 'cancelled':
      return 'Otkazano';
    case 'postponed':
      return 'Odloženo';
    default:
      return value ?? '';
  }
}

export function prettyMartialArt(value?: string | null): string {
  const v = (value || '').toLowerCase();
  switch (v) {
    case 'mixed martial arts':
    case 'mma':
      return 'Mešovite borilačke veštine';
    case 'boxing':
      return 'Boks';
    case 'kickboxing':
      return 'Kik-boks';
    case 'muay thai':
      return 'Muaj-taj';
    case 'brazilian jiu-jitsu':
    case 'bjj':
      return 'Brazilski džiu-džicu';
    case 'wrestling':
      return 'Rvanje';
    case 'judo':
      return 'Džudo';
    case 'karate':
      return 'Karate';
    case 'taekwondo':
      return 'Tekvondo';
    default:
      return value ?? '';
  }
}

export function prettySkillLevel(value?: string | null): string {
  const v = (value || '').toLowerCase();
  switch (v) {
    case 'beginner':
      return 'Početni';
    case 'intermediate':
      return 'Srednji';
    case 'advanced':
      return 'Napredni';
    case 'professional':
      return 'Profesionalni';
    default:
      return value ?? '';
  }
}

export function prettyNewsCategory(value?: string | null): string {
  const v = (value || '').toLowerCase();
  switch (v) {
    case 'fight results':
      return 'Rezultati borbi';
    case 'upcoming fights':
      return 'Predstojeće borbe';
    case 'fighter news':
      return 'Vesti o borcima';
    case 'organization news':
      return 'Vesti iz organizacija';
    case 'injuries':
      return 'Povrede';
    case 'rankings':
      return 'Rang liste';
    case 'interviews':
      return 'Intervjui';
    case 'analysis':
      return 'Analize';
    case 'technique':
      return 'Tehnika';
    default:
      return value ?? '';
  }
}