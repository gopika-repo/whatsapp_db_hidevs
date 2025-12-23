import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';

// Update this to your deployed backend URL
export const API_BASE_URL = "https://whatsapp-backend-fci4.onrender.com";

// Storage keys
export const STORAGE_KEYS = {
  token: "token",
  user: "user",
};

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        // Temporarily disable refresh token logic since backend has no JWT yet
        // const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
        // if (error.response?.status === 401 && !originalRequest._retry) {
        //   originalRequest._retry = true;
        //   try {
        //     const refreshToken = this.getRefreshToken();
        //     if (refreshToken) {
        //       const response = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
        //       const { token } = response.data;
        //       this.setToken(token);
        //       if (originalRequest.headers) {
        //         originalRequest.headers.Authorization = `Bearer ${token}`;
        //       }
        //       return this.client(originalRequest);
        //     }
        //   } catch (refreshError) {
        //     this.clearAuth();
        //     if (typeof window !== 'undefined') window.location.href = '/login';
        //     return Promise.reject(refreshError);
        //   }
        // }

        // Simply reject the error for now
        return Promise.reject(error);
      }
    );
  }

  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(STORAGE_KEYS.token);
  }

  private getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('refresh_token');
  }

  private setToken(token: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.token, token);
    }
  }

  private clearAuth() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.token);
      localStorage.removeItem(STORAGE_KEYS.user);
      localStorage.removeItem('refresh_token');
    }
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }
}

export const apiClient = new ApiClient();
