import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as SecureStore from 'expo-secure-store';
import { apiClient } from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'moderator' | 'user';
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await apiClient.post('/auth/login', {
            email,
            password,
          });

          if (response.data.success) {
            const { user, token } = response.data.data;
            
            // Store token securely
            await SecureStore.setItemAsync('auth_token', token);
            
            set({
              user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
            
            return true;
          } else {
            set({
              error: response.data.error || 'Login failed',
              isLoading: false,
            });
            return false;
          }
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Login failed';
          set({
            error: message,
            isLoading: false,
          });
          return false;
        }
      },

      register: async (name: string, email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await apiClient.post('/auth/register', {
            name,
            email,
            password,
          });

          if (response.data.success) {
            const { user, token } = response.data.data;
            
            // Store token securely
            await SecureStore.setItemAsync('auth_token', token);
            
            set({
              user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
            
            return true;
          } else {
            set({
              error: response.data.error || 'Registration failed',
              isLoading: false,
            });
            return false;
          }
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Registration failed';
          set({
            error: message,
            isLoading: false,
          });
          return false;
        }
      },

      logout: async () => {
        try {
          // Remove token
          await SecureStore.deleteItemAsync('auth_token');
          
          set({
            user: null,
            isAuthenticated: false,
            error: null,
          });
        } catch (error) {
          console.error('Logout error:', error);
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
