import { useState, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';

interface UseApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

export const useApi = <T = unknown>(options?: UseApiOptions<T>) => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const request = useCallback(
    async (method: 'get' | 'post' | 'put' | 'patch' | 'delete', url: string, payload?: unknown) => {
      setIsLoading(true);
      setError(null);

      try {
        let response;
        
        switch (method) {
          case 'get':
            response = await apiClient.get<T>(url);
            break;
          case 'post':
            response = await apiClient.post<T>(url, payload);
            break;
          case 'put':
            response = await apiClient.put<T>(url, payload);
            break;
          case 'patch':
            response = await apiClient.patch<T>(url, payload);
            break;
          case 'delete':
            response = await apiClient.delete<T>(url);
            break;
        }

        setData(response);
        options?.onSuccess?.(response);
        return response;
      } catch (err) {
        const error = err as { response?: { data?: { message?: string } }; message?: string };
        const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
        setError(errorMessage);
        options?.onError?.(err as Error);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [options]
  );

  const get = useCallback((url: string) => request('get', url), [request]);
  const post = useCallback((url: string, data?: unknown) => request('post', url, data), [request]);
  const put = useCallback((url: string, data?: unknown) => request('put', url, data), [request]);
  const patch = useCallback((url: string, data?: unknown) => request('patch', url, data), [request]);
  const del = useCallback((url: string) => request('delete', url), [request]);

  return {
    data,
    error,
    isLoading,
    get,
    post,
    put,
    patch,
    delete: del,
  };
};
