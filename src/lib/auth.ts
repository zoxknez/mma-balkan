import { create } from 'zustand';
import { apiClient } from './api/client';
import { UserProfile } from './types';
import { toast } from 'react-hot-toast';

interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface RegisterData {
  email: string;
  password: string;
  username: string;
  firstName?: string;
  lastName?: string;
}

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<boolean>;
  changePassword: (data: ChangePasswordData) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  clearError: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const res = await apiClient.post<{ user: UserProfile; accessToken: string }>('/api/auth/login', credentials);
      
      if (res.success && res.data) {
        const { setTokens } = await import('./api/client');
        setTokens(res.data.accessToken);
        
        set({ user: res.data.user, isAuthenticated: true, isLoading: false });
        toast.success('Uspešno ste se prijavili!');
        return true;
      } else {
        set({ error: res.error || 'Došlo je do greške prilikom prijave', isLoading: false });
        toast.error(res.error || 'Neuspešna prijava');
        return false;
      }
    } catch {
      set({ error: 'Greška na serveru', isLoading: false });
      return false;
    }
  },

  register: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const res = await apiClient.post<{ user: UserProfile; accessToken: string }>('/api/auth/register', data);
      
      if (res.success && res.data) {
        const { setTokens } = await import('./api/client');
        setTokens(res.data.accessToken);
        
        set({ user: res.data.user, isAuthenticated: true, isLoading: false });
        toast.success('Uspešna registracija!');
        return true;
      } else {
        set({ error: res.error || 'Došlo je do greške prilikom registracije', isLoading: false });
        toast.error(res.error || 'Neuspešna registracija');
        return false;
      }
    } catch {
      set({ error: 'Greška na serveru', isLoading: false });
      return false;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await apiClient.post('/api/auth/logout', {});
      const { clearTokens } = await import('./api/client');
      clearTokens();
      set({ user: null, isAuthenticated: false, isLoading: false });
      toast.success('Odjavljeni ste');
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    } catch {
      set({ isLoading: false });
    }
  },

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const res = await apiClient.get<{ user: UserProfile }>('/api/auth/me');
      if (res.success && res.data) {
        set({ user: res.data.user, isAuthenticated: true, isLoading: false });
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  updateProfile: async (data) => {
    set({ isLoading: true });
    try {
      const res = await apiClient.put<{ user: UserProfile }>('/api/users/profile', data);
      if (res.success && res.data) {
        set({ user: res.data.user, isLoading: false });
        toast.success('Profil ažuriran');
        return true;
      }
      set({ isLoading: false, error: res.error || 'Greška' });
      return false;
    } catch {
      set({ isLoading: false, error: 'Greška' });
      return false;
    }
  },

  changePassword: async (data) => {
    set({ isLoading: true });
    try {
      const res = await apiClient.post('/api/auth/change-password', data);
      if (res.success) {
        set({ isLoading: false });
        toast.success('Lozinka promenjena');
        return true;
      }
      set({ isLoading: false, error: res.error || 'Greška' });
      return false;
    } catch {
      set({ isLoading: false, error: 'Greška' });
      return false;
    }
  },

  resetPassword: async (email) => {
    set({ isLoading: true });
    try {
      const res = await apiClient.post('/api/auth/forgot-password', { email });
      if (res.success) {
        set({ isLoading: false });
        toast.success('Link za resetovanje lozinke je poslat');
        return true;
      }
      set({ isLoading: false, error: res.error || 'Greška prilikom slanja linka' });
      return false;
    } catch {
      set({ isLoading: false, error: 'Greška na serveru' });
      return false;
    }
  },

  clearError: () => set({ error: null }),
}));

export const authUtils = {
  validateEmail: (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  },
  validatePassword: (password: string) => {
    const feedback: string[] = [];
    let score = 0;

    if (password.length >= 8) score += 1;
    else feedback.push('Najmanje 8 karaktera');

    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push('Najmanje jedno veliko slovo');

    if (/[a-z]/.test(password)) score += 1;
    else feedback.push('Najmanje jedno malo slovo');

    if (/[0-9]/.test(password)) score += 1;
    else feedback.push('Najmanje jedan broj');

    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    else feedback.push('Najmanje jedan specijalni karakter');

    return {
      isValid: score >= 3,
      score,
      feedback
    };
  },
  getPasswordStrengthColor: (score: number) => {
    if (score < 2) return 'text-red-500';
    if (score < 4) return 'text-yellow-500';
    return 'text-green-500';
  },
  getPasswordStrengthText: (score: number) => {
    if (score < 2) return 'Slaba';
    if (score < 4) return 'Srednja';
    return 'Jaka';
  },
  getInitials: (user: UserProfile) => {
    if (!user) return 'U';
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    return user.username.slice(0, 2).toUpperCase();
  },
  getRoleDisplayName: (role: string) => {
    switch (role) {
      case 'admin': return 'Administrator';
      case 'moderator': return 'Moderator';
      case 'fighter': return 'Borac';
      default: return 'Korisnik';
    }
  },
  getRoleColor: (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-500/20 text-red-400';
      case 'moderator': return 'bg-purple-500/20 text-purple-400';
      case 'fighter': return 'bg-blue-500/20 text-blue-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  },
  isModerator: (user: UserProfile | null) => {
    if (!user) return false;
    return ['admin', 'moderator'].includes(user.role);
  }
};