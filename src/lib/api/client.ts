import { logger } from '../logger';

// Token management
let accessToken: string | null = null;

export function setTokens(access: string) {
  accessToken = access;
  if (typeof window !== 'undefined') {
    // Only store access token in memory or short-lived storage if needed
    // For better security, keep it in memory only
  }
}

export function clearTokens() {
  accessToken = null;
}

export function getAccessToken(): string | null {
  return accessToken;
}

// API Configuration
export const API_CONFIG = {
  // U dev koristi relativni URL (proxy preko Next rewrites); u prod koristi NEXT_PUBLIC_API_URL
  BASE_URL: process.env.NODE_ENV === 'development' ? '' : (process.env['NEXT_PUBLIC_API_URL'] || ''),
  ENDPOINTS: {
    // Auth
    AUTH_LOGIN: '/api/auth/login',
    AUTH_REGISTER: '/api/auth/register',
    AUTH_LOGOUT: '/api/auth/logout',
    AUTH_REFRESH: '/api/auth/refresh',
    AUTH_ME: '/api/auth/me',
    AUTH_CHANGE_PASSWORD: '/api/auth/change-password',
    CSRF_TOKEN: '/api/csrf-token',

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
  private refreshing: Promise<boolean> | null = null;

  constructor(baseUrl: string = API_CONFIG.BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async refreshAccessToken(): Promise<boolean> {
    if (this.refreshing) {
      return this.refreshing;
    }

    this.refreshing = (async () => {
      try {
        // Refresh token is now handled via HttpOnly cookie
        const response = await fetch(`${this.baseUrl}/api/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          // No body needed, cookie is sent automatically
        });

        if (!response.ok) {
          clearTokens();
          this.redirectToLogin();
          return false;
        }

        const result = await response.json();
        if (result.success && result.data) {
          setTokens(result.data.accessToken);
          return true;
        }

        clearTokens();
        this.redirectToLogin();
        return false;
      } catch (error) {
        console.error('Token refresh failed:', error);
        clearTokens();
        this.redirectToLogin();
        return false;
      } finally {
        this.refreshing = null;
      }
    })();

    return this.refreshing;
  }

  private redirectToLogin(): void {
    // Only redirect on client-side
    if (typeof window !== 'undefined') {
      // Store current URL for redirect after login
      const currentPath = window.location.pathname + window.location.search;
      if (currentPath !== '/login' && currentPath !== '/register') {
        localStorage.setItem('redirectAfterLogin', currentPath);
      }
      
      // Redirect to login page
      window.location.href = '/login';
    }
  }

  private async request<T>(
    endpoint: string,
    method: HttpMethod = 'GET',
    data?: unknown,
    customHeaders?: Record<string, string>,
    retry = true,
    retryCount = 0,
    maxRetries = 3
  ): Promise<ApiResponse<T>> {
    const t = withTimeout(15000);
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const token = getAccessToken();
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...customHeaders,
      };

      if (token && !endpoint.includes('/auth/')) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const config: RequestInit = {
        method,
        headers,
        signal: t.signal,
      };
      
      if (method === 'GET') {
        config.cache = 'no-store';
      }

      if (data !== undefined && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        config.body = JSON.stringify(data as Record<string, unknown>);
      }

      const response = await fetch(url, config);
      
      // Handle 401 Unauthorized - try to refresh token
      if (response.status === 401 && retry && !endpoint.includes('/auth/')) {
        const refreshed = await this.refreshAccessToken();
        if (refreshed) {
          return this.request<T>(endpoint, method, data, customHeaders, false);
        }
      }

      // Handle 5xx errors with exponential backoff retry
      if (response.status >= 500 && retryCount < maxRetries && method === 'GET') {
        const delay = Math.min(1000 * Math.pow(2, retryCount), 10000);
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.request<T>(endpoint, method, data, customHeaders, retry, retryCount + 1, maxRetries);
      }

      // Validate Content-Type before parsing JSON
      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        // Handle non-JSON responses gracefully
        if (!response.ok) {
          return {
            success: false,
            error: `HTTP Error: ${response.status} - Unexpected response type`,
          };
        }
        // For successful non-JSON responses, try to parse as text
        const text = await response.text();
        logger.warn(`Non-JSON response from ${endpoint}:`, text.substring(0, 100));
        return {
          success: false,
          error: 'Unexpected response format from server',
        };
      }

      const result = await response.json();

      if (!response.ok) {
        const error: ApiResponse<T> = {
          success: false,
          error: result.error || result.message || `HTTP Error: ${response.status}`,
          message: result.message,
        };
        return error;
      }

      return result;
    } catch (error) {
      logger.error(`API Error [${method} ${endpoint}]`, error);
      
      // Handle network errors with retry
      if (error instanceof Error && error.name === 'AbortError') {
        return {
          success: false,
          error: 'Request timeout. Please try again.',
        };
      }
      
      if (retryCount < maxRetries && method === 'GET') {
        const delay = Math.min(1000 * Math.pow(2, retryCount), 10000);
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.request<T>(endpoint, method, data, customHeaders, retry, retryCount + 1, maxRetries);
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error. Please check your connection.',
      };
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