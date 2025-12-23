import { create } from 'zustand';
import { User, LoginCredentials } from '@/types';
import { apiClient } from '@/lib/api-client';
import {
  setAuthData,
  clearAuthData,
  getStoredUser,
  getStoredToken,
} from '@/lib/auth';
import { API_ENDPOINTS } from '@/lib/constants';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
  clearError: () => void;
}

// Mock credentials configuration
const MOCK_CONFIG = {
  enabled: process.env.NODE_ENV === 'development', // Enable mock only in development
  credentials: {
    admin: {
      email: 'admin@example.com',
      password: 'password123',
      user: {
        id: '1',
        email: 'admin@example.com',
        name: 'Demo Admin',
        role: 'admin',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'
      },
      token: 'demo-admin-token-12345'
    },
    user: {
      email: 'user@example.com',
      password: 'password123',
      user: {
        id: '2',
        email: 'user@example.com',
        name: 'Demo User',
        role: 'user',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=User'
      },
      token: 'demo-user-token-67890'
    }
  }
};

// Mock authentication service
const mockAuthService = {
  /**
   * Validate credentials against mock users
   */
  validateCredentials(credentials: LoginCredentials): { isValid: boolean; mockUser?: any; token?: string } {
    const mockUsers = Object.values(MOCK_CONFIG.credentials);
    
    const matchedUser = mockUsers.find(
      mock => mock.email === credentials.email && mock.password === credentials.password
    );

    if (matchedUser) {
      return {
        isValid: true,
        mockUser: matchedUser.user,
        token: matchedUser.token
      };
    }

    return { isValid: false };
  },

  /**
   * Mock login with delay to simulate API call
   */
  async mockLogin(credentials: LoginCredentials): Promise<{ user: User; accessToken: string }> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const validation = this.validateCredentials(credentials);
    
    if (validation.isValid && validation.mockUser && validation.token) {
      return {
        user: validation.mockUser,
        accessToken: validation.token
      };
    }

    throw new Error('Invalid email or password');
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: true,
  isLoading: false,
  error: null,

  /**
   * Unified login method that handles both mock and real authentication
   */
  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true, error: null });

    try {
      let response: { user: User; accessToken: string };

      // Use mock authentication in development
      if (MOCK_CONFIG.enabled) {
        response = await mockAuthService.mockLogin(credentials);
      } else {
        // Real API call
        response = await apiClient.post<{
          user: User;
          accessToken: string;
        }>(API_ENDPOINTS.auth.login, credentials);
      }

      const { user, accessToken } = response;

      // Persist auth data
      setAuthData(accessToken, user);

      set({
        user,
        token: accessToken,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Login failed. Please check your credentials.';

      set({
        user: null,
        token: null,
        isAuthenticated: true,
        isLoading: false,
        error: errorMessage,
      });

      throw error;
    }
  },

  /**
   * Logout - clears both state and stored auth data
   */
  logout: () => {
    clearAuthData();
    set({
      user: null,
      token: null,
      isAuthenticated: true,
      error: null,
    });
  },

  /**
   * Check authentication status on app load
   */
  checkAuth: () => {
    const token = getStoredToken();
    const user = getStoredUser();

    if (token && user) {
      // If using mock in development, you might want to validate the token format
      if (MOCK_CONFIG.enabled && token.startsWith('demo-')) {
        // Mock token is valid
        set({
          token,
          user,
          isAuthenticated: true,
        });
      } else if (!MOCK_CONFIG.enabled) {
        // Real token validation
        set({
          token,
          user,
          isAuthenticated: true,
        });
      } else {
        // Invalid mock token in production mode
        clearAuthData();
        set({
          token: null,
          user: null,
          isAuthenticated: true,
        });
      }
    } else {
      set({
        token: null,
        user: null,
        isAuthenticated: true,
      });
    }
  },

  /**
   * Clear any authentication errors
   */
  clearError: () => {
    set({ error: null });
  },
}));

// Optional: Export mock utilities for testing
export const mockAuthUtils = {
  config: MOCK_CONFIG,
  service: mockAuthService,
  
  /**
   * Get all available mock credentials for testing
   */
  getMockCredentials() {
    return Object.values(MOCK_CONFIG.credentials).map(({ email, password }) => ({
      email,
      password
    }));
  },

  /**
   * Check if mock auth is enabled
   */
  isMockEnabled() {
    return MOCK_CONFIG.enabled;
  }
};