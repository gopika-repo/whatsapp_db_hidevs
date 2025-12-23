import { useEffect } from 'react';
import { useAuthStore } from '@/store/use-auth-store';

export const useAuth = () => {
  const { user, token, isAuthenticated, isLoading, error, login, logout, checkAuth, clearError } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    clearError,
  };
};