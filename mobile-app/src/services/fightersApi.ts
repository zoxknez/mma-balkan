import { apiClient } from './api';

export interface Fighter {
  id: string;
  name: string;
  record: string;
  weightClass: string;
  nationality: string;
  age: number;
  height: string;
  reach: string;
  image?: string;
  isActive: boolean;
  bio?: string;
  fightingStyle?: string;
  gym?: string;
  coach?: string;
  stats: {
    wins: number;
    losses: number;
    draws: number;
    noContests: number;
    knockouts: number;
    submissions: number;
    decisions: number;
  };
  recentFights: Fight[];
}

export interface Fight {
  id: string;
  opponent: string;
  result: 'win' | 'loss' | 'draw' | 'nc';
  method: string;
  round: number;
  date: string;
  event: string;
}

export interface FightersResponse {
  data: Fighter[];
  total: number;
  page: number;
  limit: number;
}

export interface FighterFilters {
  search?: string;
  weightClass?: string;
  nationality?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export const fightersApi = {
  // Get all fighters with filters
  getFighters: async (filters: FighterFilters = {}): Promise<FightersResponse> => {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.weightClass) params.append('weightClass', filters.weightClass);
    if (filters.nationality) params.append('nationality', filters.nationality);
    if (filters.isActive !== undefined) params.append('isActive', filters.isActive.toString());
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const response = await apiClient.get(`/fighters?${params.toString()}`);
    return response.data;
  },

  // Get single fighter by ID
  getFighter: async (id: string): Promise<Fighter> => {
    const response = await apiClient.get(`/fighters/${id}`);
    return response.data.data;
  },

  // Follow a fighter
  followFighter: async (id: string): Promise<void> => {
    await apiClient.post(`/fighters/${id}/follow`);
  },

  // Unfollow a fighter
  unfollowFighter: async (id: string): Promise<void> => {
    await apiClient.delete(`/fighters/${id}/follow`);
  },

  // Get followed fighters
  getFollowedFighters: async (): Promise<Fighter[]> => {
    const response = await apiClient.get('/fighters/followed');
    return response.data.data;
  },

  // Get fighter stats
  getFighterStats: async (id: string) => {
    const response = await apiClient.get(`/fighters/${id}/stats`);
    return response.data.data;
  },

  // Get fighter fights
  getFighterFights: async (id: string, page = 1, limit = 10) => {
    const response = await apiClient.get(`/fighters/${id}/fights?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Search fighters
  searchFighters: async (query: string): Promise<Fighter[]> => {
    const response = await apiClient.get(`/fighters/search?q=${encodeURIComponent(query)}`);
    return response.data.data;
  },

  // Get top fighters
  getTopFighters: async (limit = 10): Promise<Fighter[]> => {
    const response = await apiClient.get(`/fighters/top?limit=${limit}`);
    return response.data.data;
  },

  // Get fighters by weight class
  getFightersByWeightClass: async (weightClass: string): Promise<Fighter[]> => {
    const response = await apiClient.get(`/fighters/weight-class/${weightClass}`);
    return response.data.data;
  },
};
