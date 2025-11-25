"use client";

import { useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/lib/auth';
import { initializeCSRF, clearCSRFToken } from '@/lib/csrf';

/**
 * Hook to initialize authentication and CSRF protection on app load
 * Should be used in the root layout or providers component
 */
export function useAuthInit() {
  const { checkAuth, isLoading } = useAuth();
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const init = async () => {
      // Initialize CSRF protection
      await initializeCSRF();
      
      // Check if user is already authenticated
      await checkAuth();
    };

    init();
  }, [checkAuth]);

  return { isLoading };
}

/**
 * Hook to handle logout with proper cleanup
 */
export function useLogout() {
  const { logout } = useAuth();

  const handleLogout = useCallback(async () => {
    // Clear CSRF token on logout
    clearCSRFToken();
    
    // Perform logout
    await logout();
  }, [logout]);

  return handleLogout;
}

/**
 * Hook to require authentication
 * Redirects to login if not authenticated
 */
export function useRequireAuth(redirectTo: string = '/login') {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Store current URL for redirect after login
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname + window.location.search;
        if (currentPath !== '/login' && currentPath !== '/register') {
          localStorage.setItem('redirectAfterLogin', currentPath);
        }
        window.location.href = redirectTo;
      }
    }
  }, [isAuthenticated, isLoading, redirectTo]);

  return { isAuthenticated, isLoading };
}

/**
 * Hook to require specific role
 */
export function useRequireRole(
  requiredRoles: string[],
  redirectTo: string = '/'
) {
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      if (!requiredRoles.includes(user.role)) {
        if (typeof window !== 'undefined') {
          window.location.href = redirectTo;
        }
      }
    }
  }, [user, isAuthenticated, isLoading, requiredRoles, redirectTo]);

  const hasRole = user ? requiredRoles.includes(user.role) : false;

  return { hasRole, isLoading };
}

/**
 * Hook for admin-only pages
 */
export function useRequireAdmin() {
  return useRequireRole(['ADMIN'], '/');
}

/**
 * Hook for moderator-only pages
 */
export function useRequireModerator() {
  return useRequireRole(['ADMIN', 'MODERATOR'], '/');
}
