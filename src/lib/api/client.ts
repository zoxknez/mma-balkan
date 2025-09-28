// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003',
  ENDPOINTS: {
    // Fighters
    FIGHTERS: '/api/fighters',
    FIGHTER_BY_ID: (id: string) => `/api/fighters/${id}`,
    TRENDING_FIGHTERS: '/api/fighters/trending',
    FIGHTER_FIGHTS: (id: string) => `/api/fighters/${id}/fights`,
    FIGHTER_UPCOMING: (id: string) => `/api/fighters/${id}/upcoming`,
    
    // Events
    EVENTS: '/api/events',
    EVENT_BY_ID: (id: string) => `/api/events/${id}`,
    UPCOMING_EVENTS: '/api/events/upcoming',
    LIVE_EVENTS: '/api/events/live',
  EVENT_FIGHTS: (id: string) => `/api/events/${id}/fights`,
    
    // Clubs
    CLUBS: '/api/clubs',
    CLUB_BY_ID: (id: string) => `/api/clubs/${id}`,
    NEARBY_CLUBS: '/api/clubs/nearby',
    
    // Organizations
    ORGANIZATIONS: '/api/organizations',
    ORGANIZATION_BY_ID: (id: string) => `/api/organizations/${id}`,
    
    // News
    NEWS: '/api/news',
    NEWS_BY_ID: (id: string) => `/api/news/${id}`,
    LATEST_NEWS: '/api/news/latest',
  NEWS_VIEW: (id: string) => `/api/news/${id}/view`,
  NEWS_LIKE: (id: string) => `/api/news/${id}/like`,
    
    // Predictions
    PREDICTIONS: '/api/predictions',
    USER_PREDICTIONS: (userId: string) => `/api/predictions/user/${userId}`,
    FIGHT_PREDICTIONS: (fightId: string) => `/api/predictions/fight/${fightId}`,
    
    // User
    USER_PROFILE: (userId: string) => `/api/users/${userId}`,
    USER_WATCHLIST: (userId: string) => `/api/users/${userId}/watchlist`,
    USER_FOLLOWERS: (userId: string) => `/api/users/${userId}/followers`,
    
    // Search
    SEARCH: '/api/search',
    SEARCH_SUGGESTIONS: '/api/search/suggestions',
    
    // External APIs
    WIKIDATA_SPARQL: 'https://query.wikidata.org/sparql',
    WIKIPEDIA_API: 'https://en.wikipedia.org/api/rest_v1',
    THESPORTSDB_API: 'https://www.thesportsdb.com/api/v1/json',
  }
};

// HTTP Methods
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Base API client
const withTimeout = (ms: number) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  return { signal: controller.signal, clear: () => clearTimeout(id) };
};

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_CONFIG.BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    method: HttpMethod = 'GET',
    data?: unknown,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    const t = withTimeout(15000);
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const config: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        signal: t.signal,
        cache: method === 'GET' ? 'no-store' : undefined,
      };

      if (data !== undefined && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        config.body = JSON.stringify(data as Record<string, unknown>);
      }

      const response = await fetch(url, config);
  const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || `HTTP Error: ${response.status}`);
      }

      return result;
    } catch (error) {
      const { logger } = await import('../logger');
      logger.error(`API Error [${method} ${endpoint}]`, error);
      throw error;
    } finally {
      t.clear();
    }
  }

  // GET request
  async get<T>(endpoint: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, 'GET', undefined, headers);
  }

  // POST request
  async post<T>(endpoint: string, data: unknown, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, 'POST', data, headers);
  }

  // PUT request
  async put<T>(endpoint: string, data: unknown, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, 'PUT', data, headers);
  }

  // DELETE request
  async delete<T>(endpoint: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, 'DELETE', undefined, headers);
  }

  // PATCH request
  async patch<T>(endpoint: string, data: unknown, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, 'PATCH', data, headers);
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Helper function to get auth headers
export function getAuthHeaders(token?: string): Record<string, string> {
  const headers: Record<string, string> = {};
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
}

// Query parameters helper
export function buildQueryParams<T extends object>(params: T): string {
  const searchParams = new URLSearchParams();
  
  for (const [key, value] of Object.entries(params as Record<string, unknown>)) {
    if (value === undefined || value === null) continue;
    if (Array.isArray(value)) {
      for (const v of value) searchParams.append(key, String(v));
    } else if (typeof value === 'object') {
      // flatten simple objects as JSON
      searchParams.append(key, JSON.stringify(value));
    } else if (value !== '') {
      searchParams.append(key, String(value));
    }
  }
  
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

// Cache helper for client-side caching
class ApiCache<T = unknown> {
  private cache = new Map<string, { data: T; timestamp: number; ttl: number }>();
  
  set(key: string, data: T, ttlSeconds: number = 300): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlSeconds * 1000
    });
  }
  
  get(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) return null;
    
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }
  
  clear(): void {
    this.cache.clear();
  }
  
  delete(key: string): void {
    this.cache.delete(key);
  }
}

export const apiCache = new ApiCache();