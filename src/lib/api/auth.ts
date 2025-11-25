import { apiClient, API_CONFIG, setTokens, clearTokens, getAccessToken } from './client';

export interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  role: 'user' | 'admin' | 'moderator';
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export class AuthService {
  // Register new user
  static async register(data: RegisterData) {
    const response = await apiClient.post<AuthResponse>(
      API_CONFIG.ENDPOINTS.AUTH_REGISTER,
      data
    );

    if (response.success && response.data) {
      setTokens(response.data.accessToken);
    }

    return response;
  }

  // Login user
  static async login(credentials: LoginCredentials) {
    const response = await apiClient.post<AuthResponse>(
      API_CONFIG.ENDPOINTS.AUTH_LOGIN,
      credentials
    );

    if (response.success && response.data) {
      setTokens(response.data.accessToken);
    }

    return response;
  }

  // Logout user
  static async logout() {
    try {
      await apiClient.post(API_CONFIG.ENDPOINTS.AUTH_LOGOUT, {});
    } finally {
      clearTokens();
    }
  }

  // Get current user
  static async getCurrentUser() {
    return apiClient.get<{ user: User }>(API_CONFIG.ENDPOINTS.AUTH_ME);
  }

  // Change password
  static async changePassword(currentPassword: string, newPassword: string) {
    return apiClient.post(API_CONFIG.ENDPOINTS.AUTH_CHANGE_PASSWORD, {
      currentPassword,
      newPassword,
    });
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    return !!getAccessToken();
  }

  // Get CSRF token
  static async getCSRFToken() {
    return apiClient.get<{ csrfToken: string; sessionId: string }>(
      API_CONFIG.ENDPOINTS.CSRF_TOKEN
    );
  }
}

export default AuthService;

