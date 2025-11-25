export interface UiClub {
  id: string;
  name: string;
  city: string;
  country: string;
  members?: number | null;
}

export type SortOption = 'name' | 'members' | 'rating' | 'founded';

export const countries = ['Sve', 'Srbija', 'Hrvatska', 'Severna Makedonija', 'Bosna i Hercegovina', 'Crna Gora', 'Slovenija'];
export const specialties = ['Sve', 'MMA', 'Boxing', 'Muay Thai', 'Brazilian Jiu Jitsu', 'Wrestling', 'Kickboxing'];
