// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  ENDPOINTS: {
    // Fighters
    FIGHTERS: '/api/fighters',
    FIGHTER_BY_ID: (id: string) => `/api/fighters/${id}`,
    TRENDING_FIGHTERS: '/api/fighters/trending',
    
    // Events
    EVENTS: '/api/events',
    EVENT_BY_ID: (id: string) => `/api/events/${id}`,
    UPCOMING_EVENTS: '/api/events/upcoming',
    LIVE_EVENTS: '/api/events/live',
    
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
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_CONFIG.BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    method: HttpMethod = 'GET',
    data?: any,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const config: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
      };

      if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        config.body = JSON.stringify(data);
      }

      const response = await fetch(url, config);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || `HTTP Error: ${response.status}`);
      }

      return result;
    } catch (error) {
      console.error(`API Error [${method} ${endpoint}]:`, error);
      throw error;
    }
  }

  // GET request
  async get<T>(endpoint: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, 'GET', undefined, headers);
  }

  // POST request
  async post<T>(endpoint: string, data: any, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, 'POST', data, headers);
  }

  // PUT request
  async put<T>(endpoint: string, data: any, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, 'PUT', data, headers);
  }

  // DELETE request
  async delete<T>(endpoint: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, 'DELETE', undefined, headers);
  }

  // PATCH request
  async patch<T>(endpoint: string, data: any, headers?: Record<string, string>): Promise<ApiResponse<T>> {
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
export function buildQueryParams(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });
  
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

// Cache helper for client-side caching
class ApiCache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  
  set(key: string, data: any, ttlSeconds: number = 300): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlSeconds * 1000
    });
  }
  
  get(key: string): any | null {
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