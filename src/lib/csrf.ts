/**
 * CSRF Protection utilities for frontend
 * Integrates with backend CSRF token generation
 */

import { apiClient } from './api/client';

// CSRF Token storage
let csrfToken: string | null = null;
let sessionId: string | null = null;
let tokenExpiry: number = 0;

const CSRF_HEADER_NAME = 'X-CSRF-Token';
const SESSION_HEADER_NAME = 'X-Session-Id';
const TOKEN_REFRESH_BUFFER = 60000; // Refresh 1 minute before expiry

interface CSRFResponse {
  csrfToken: string;
  sessionId: string;
}

/**
 * Fetch a new CSRF token from the server
 */
export async function fetchCSRFToken(): Promise<string | null> {
  try {
    const response = await apiClient.get<CSRFResponse>('/api/csrf-token');
    
    if (response.success && response.data) {
      csrfToken = response.data.csrfToken;
      sessionId = response.data.sessionId;
      // Tokens expire in 15 minutes
      tokenExpiry = Date.now() + 15 * 60 * 1000;
      
      return csrfToken;
    }
    
    return null;
  } catch (error) {
    console.error('Failed to fetch CSRF token:', error);
    return null;
  }
}

/**
 * Get the current CSRF token, fetching a new one if needed
 */
export async function getCSRFToken(): Promise<string | null> {
  // Check if token exists and is not about to expire
  if (csrfToken && Date.now() < tokenExpiry - TOKEN_REFRESH_BUFFER) {
    return csrfToken;
  }
  
  return fetchCSRFToken();
}

/**
 * Get the current session ID
 */
export function getSessionId(): string | null {
  return sessionId;
}

/**
 * Clear CSRF token (call on logout)
 */
export function clearCSRFToken(): void {
  csrfToken = null;
  sessionId = null;
  tokenExpiry = 0;
}

/**
 * Get headers with CSRF token for fetch requests
 */
export async function getCSRFHeaders(): Promise<Record<string, string>> {
  const token = await getCSRFToken();
  const headers: Record<string, string> = {};
  
  if (token) {
    headers[CSRF_HEADER_NAME] = token;
  }
  
  if (sessionId) {
    headers[SESSION_HEADER_NAME] = sessionId;
  }
  
  return headers;
}

/**
 * Create a fetch wrapper that includes CSRF token
 */
export async function fetchWithCSRF(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const csrfHeaders = await getCSRFHeaders();
  
  const headers = new Headers(options.headers);
  Object.entries(csrfHeaders).forEach(([key, value]) => {
    headers.set(key, value);
  });
  
  return fetch(url, {
    ...options,
    headers,
    credentials: 'include', // Include cookies for session
  });
}

/**
 * Hook to use CSRF protection in forms
 */
export function useCSRF() {
  const getToken = async () => {
    return getCSRFToken();
  };
  
  const getHeaders = async () => {
    return getCSRFHeaders();
  };
  
  const submitForm = async (
    url: string,
    data: Record<string, unknown>,
    method: 'POST' | 'PUT' | 'DELETE' = 'POST'
  ) => {
    const headers = await getCSRFHeaders();
    
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify(data),
      credentials: 'include',
    });
    
    return response;
  };
  
  return {
    getToken,
    getHeaders,
    submitForm,
    clear: clearCSRFToken,
  };
}

/**
 * Initialize CSRF protection on app load
 */
export async function initializeCSRF(): Promise<void> {
  // Only initialize in browser
  if (typeof window === 'undefined') return;
  
  // Fetch initial token
  await fetchCSRFToken();
  
  // Set up token refresh interval
  const refreshInterval = setInterval(async () => {
    if (Date.now() >= tokenExpiry - TOKEN_REFRESH_BUFFER) {
      await fetchCSRFToken();
    }
  }, 60000); // Check every minute
  
  // Clean up on page unload
  window.addEventListener('beforeunload', () => {
    clearInterval(refreshInterval);
  });
}

// Export constants for use in components
export const CSRF_HEADER = CSRF_HEADER_NAME;
export const SESSION_HEADER = SESSION_HEADER_NAME;
