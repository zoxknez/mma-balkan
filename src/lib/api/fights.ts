import { apiClient, API_CONFIG } from './client';

export type Fight = {
  id: string;
  eventId: string;
  orderNo: number;
  section?: 'MAIN' | 'PRELIMS' | string;
  weightClass?: string | null;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | string;
  method?: string | null;
  round?: number | null;
  time?: string | null;
  redFighterId: string;
  blueFighterId: string;
  winnerFighterId?: string | null;
  event?: { id: string; name: string; startAt: string };
  redFighter?: { id: string; name: string };
  blueFighter?: { id: string; name: string };
};

export const getEventFights = (eventId: string) => apiClient.get<Fight[]>(API_CONFIG.ENDPOINTS.EVENT_FIGHTS(eventId));
export const getFighterFights = (fighterId: string) => apiClient.get<Fight[]>(API_CONFIG.ENDPOINTS.FIGHTER_FIGHTS(fighterId));
export const getFighterUpcomingFights = (fighterId: string) => apiClient.get<Fight[]>(API_CONFIG.ENDPOINTS.FIGHTER_UPCOMING(fighterId));
