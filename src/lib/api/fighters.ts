import { apiClient, API_CONFIG, buildQueryParams, ApiResponse } from './client';
import { logger } from '../logger';
import { Fighter, WeightClass } from '@/lib/types';

// Fighter query parameters
export interface FighterQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  weightClass?: WeightClass;
  country?: string;
  organization?: string;
  isActive?: boolean;
  sortBy?: 'name' | 'wins' | 'losses' | 'ranking' | 'lastFight';
  sortOrder?: 'asc' | 'desc';
}

// Fighter statistics
export interface FighterStats {
  totalFighters: number;
  activeFighters: number;
  byWeightClass: Record<WeightClass, number>;
  byCountry: Record<string, number>;
  winMethods: {
    ko: number;
    submission: number;
    decision: number;
  };
}

// Fighter service class
export class FighterService {
  // Get all fighters with filtering and pagination
  static async getFighters(params: FighterQueryParams = {}): Promise<ApiResponse<Fighter[]>> {
    const queryString = buildQueryParams(params);
    return apiClient.get<Fighter[]>(`${API_CONFIG.ENDPOINTS.FIGHTERS}${queryString}`);
  }

  // Get fighter by ID
  static async getFighterById(id: string): Promise<ApiResponse<Fighter>> {
    return apiClient.get<Fighter>(API_CONFIG.ENDPOINTS.FIGHTER_BY_ID(id));
  }

  // Get trending fighters
  static async getTrendingFighters(limit: number = 10): Promise<ApiResponse<Fighter[]>> {
    const queryString = buildQueryParams({ limit });
    return apiClient.get<Fighter[]>(`${API_CONFIG.ENDPOINTS.TRENDING_FIGHTERS}${queryString}`);
  }

  // Search fighters
  static async searchFighters(query: string, limit: number = 20): Promise<ApiResponse<Fighter[]>> {
    const queryString = buildQueryParams({ search: query, limit });
    return apiClient.get<Fighter[]>(`${API_CONFIG.ENDPOINTS.FIGHTERS}${queryString}`);
  }

  // Get fighter statistics
  static async getFighterStats(): Promise<ApiResponse<FighterStats>> {
    return apiClient.get<FighterStats>(`${API_CONFIG.ENDPOINTS.FIGHTERS}/stats`);
  }

  // Create new fighter (admin only)
  static async createFighter(fighter: Partial<Fighter>, token: string): Promise<ApiResponse<Fighter>> {
    return apiClient.post<Fighter>(
      API_CONFIG.ENDPOINTS.FIGHTERS,
      fighter,
      { Authorization: `Bearer ${token}` }
    );
  }

  // Update fighter (admin only)
  static async updateFighter(id: string, updates: Partial<Fighter>, token: string): Promise<ApiResponse<Fighter>> {
    return apiClient.put<Fighter>(
      API_CONFIG.ENDPOINTS.FIGHTER_BY_ID(id),
      updates,
      { Authorization: `Bearer ${token}` }
    );
  }

  // Delete fighter (admin only)
  static async deleteFighter(id: string, token: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(
      API_CONFIG.ENDPOINTS.FIGHTER_BY_ID(id),
      { Authorization: `Bearer ${token}` }
    );
  }

  // Follow/unfollow fighter
  static async toggleFollowFighter(fighterId: string, token: string): Promise<ApiResponse<{ isFollowing: boolean }>> {
    return apiClient.post<{ isFollowing: boolean }>(
      `${API_CONFIG.ENDPOINTS.FIGHTER_BY_ID(fighterId)}/follow`,
      {},
      { Authorization: `Bearer ${token}` }
    );
  }

  // Get fighter's fight history
  static async getFighterFights(fighterId: string): Promise<ApiResponse<unknown[]>> {
    return apiClient.get<unknown[]>(`${API_CONFIG.ENDPOINTS.FIGHTER_BY_ID(fighterId)}/fights`);
  }

  // Get fighter's upcoming fights
  static async getFighterUpcomingFights(fighterId: string): Promise<ApiResponse<unknown[]>> {
    return apiClient.get<unknown[]>(`${API_CONFIG.ENDPOINTS.FIGHTER_BY_ID(fighterId)}/upcoming`);
  }
}

// External API integrations for fighter data
export class ExternalFighterDataService {
  // Get fighter data from Wikidata
  static async getWikidataFighter(
    fighterName: string
  ): Promise<unknown[]> {
    const query = `
      SELECT ?fighter ?fighterLabel ?birthDate ?height ?countryLabel ?image WHERE {
        ?fighter wdt:P106 wd:Q11124849 ; # Mixed martial artist
                 rdfs:label ?fighterLabel .
        FILTER (CONTAINS(LCASE(?fighterLabel), LCASE("${fighterName}")))
        OPTIONAL { ?fighter wdt:P569 ?birthDate }
        OPTIONAL { ?fighter wdt:P2048 ?height }
        OPTIONAL { ?fighter wdt:P27 ?country . ?country rdfs:label ?countryLabel }
        OPTIONAL { ?fighter wdt:P18 ?image }
        SERVICE wikibase:label { bd:serviceParam wikibase:language "en,sr" }
      }
      LIMIT 5
    `;

    const url = `${API_CONFIG.ENDPOINTS.WIKIDATA_SPARQL}?query=${encodeURIComponent(query)}&format=json`;
    
    try {
      const response = await fetch(url);
      const data: unknown = await response.json();
      const bindings = (data as { results?: { bindings?: unknown[] } })?.results?.bindings;
      return bindings ?? [];
    } catch (error) {
      logger.warn('Wikidata API error:', error);
      return [];
    }
  }

  // Get fighter data from Wikipedia
  static async getWikipediaFighter(
    fighterName: string
  ): Promise<unknown | null> {
    const searchUrl = `${API_CONFIG.ENDPOINTS.WIKIPEDIA_API}/page/summary/${encodeURIComponent(fighterName)}`;
    
    try {
      const response = await fetch(searchUrl);
      if (response.ok) {
        const json: unknown = await response.json();
        return json;
      }
      return null;
    } catch (error) {
      logger.warn('Wikipedia API error:', error);
      return null;
    }
  }

  // Get UFC fighter data from TheSportsDB
  static async getUFCFighter(
    fighterName: string
  ): Promise<unknown[]> {
    const url = `${API_CONFIG.ENDPOINTS.THESPORTSDB_API}/3/searchplayers.php?p=${encodeURIComponent(fighterName)}`;
    
    try {
      const response = await fetch(url);
      const data: unknown = await response.json();
      const players = (data as { player?: unknown[] })?.player;
      return players ?? [];
    } catch (error) {
      logger.warn('TheSportsDB API error:', error);
      return [];
    }
  }
}

// Hook for React components to use fighter data
export const useFighterService = () => {
  return {
    getFighters: FighterService.getFighters,
    getFighterById: FighterService.getFighterById,
    getTrendingFighters: FighterService.getTrendingFighters,
    searchFighters: FighterService.searchFighters,
    getFighterStats: FighterService.getFighterStats,
    toggleFollowFighter: FighterService.toggleFollowFighter,
    getFighterFights: FighterService.getFighterFights,
    getFighterUpcomingFights: FighterService.getFighterUpcomingFights,
  };
};

// Default export
export default FighterService;