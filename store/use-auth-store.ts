import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  name: string;
  role?: 'admin' | 'user';
  avatar?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

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

const MOCK_USERS = {
  admin: {
    email: 'admin@example.com',
    password: 'password123',
    user: {
      id: '1',
      email: 'admin@example.com',
      name: 'Demo Admin',
      role: 'admin' as const,
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
      role: 'user' as const,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=User'
    },
    token: 'demo-user-token-67890'
  }
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        const mockUsers = Object.values(MOCK_USERS);
        const matchedUser = mockUsers.find(
          mock => mock.email === credentials.email && mock.password === credentials.password
        );

        if (matchedUser) {
          set({
            user: matchedUser.user,
            token: matchedUser.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          return;
        }

        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: 'Invalid email or password',
        });
        throw new Error('Invalid credentials');
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      checkAuth: () => {
        const { user, token } = get();
        if (token && user) {
          set({ isAuthenticated: true });
        } else {
          set({ isAuthenticated: false });
        }
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export const mockAuthUtils = {
  getMockCredentials: () => {
    return Object.values(MOCK_USERS).map(({ email, password }) => ({
      email,
      password,
    }));
  },
  isMockEnabled: () => process.env.NODE_ENV === 'development',
};