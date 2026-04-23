import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import env from '../libs/env';
import { authService } from '../libs/auth';
import { ApiClientInterface, UserSession, ApiResponse } from '@interfaces';

export class TreisClient implements ApiClientInterface {
  private client: AxiosInstance;

  constructor(config?: { baseURL?: string; apiKey?: string }) {
    this.client = axios.create({
      baseURL: config?.baseURL || env.TREIS_API_URL,
      headers: { 'Content-Type': 'application/json', 'x-api-key': config?.apiKey || env.INTERNAL_API_KEY },
    });

    this.client.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
      if (authService.getSession()) {
        if (authService.isTokenExpired()) {
          await authService.refresh();
        }
        config.headers.Authorization = `Bearer ${authService.getSession()?.token}`;
      }
      return config;
    });

    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError<{ message?: string }>) => {
        const config = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
        if (error.response?.status === 401 && config && !config._retry) {
          config._retry = true;
          try {
            await authService.refresh();
            return this.client(config);
          } catch {
            authService.setSession(null);
          }
        }
        return Promise.reject(error);
      }
    );
  }

  async login(email: string, password: string): Promise<UserSession> {
    const response = await this.client.post<ApiResponse<UserSession>>('/auth/login', { email, password });
    const data = response.data;
    if (data.success) {
      const session = data.data;
      authService.setSession(session);
      return session;
    }
    throw new Error(data.message || 'Falha na autenticação');
  }

  getSession(): UserSession | null { return authService.getSession(); }
  isTokenExpired(): boolean { return authService.isTokenExpired(); }

  async get<T>(url: string, params?: unknown): Promise<T> {
    const res = await this.client.get<{ data: T }>(url, { params });
    return res.data.data;
  }
  async post<T>(url: string, data?: unknown): Promise<T> {
    const res = await this.client.post<{ data: T }>(url, data);
    return res.data.data;
  }
  async put<T>(url: string, data?: unknown): Promise<T> {
    const res = await this.client.put<{ data: T }>(url, data);
    return res.data.data;
  }
  async patch<T>(url: string, data?: unknown): Promise<T> {
    const res = await this.client.patch<{ data: T }>(url, data);
    return res.data.data;
  }
  async delete<T>(url: string): Promise<T> {
    const res = await this.client.delete<{ data: T }>(url);
    return res.data.data;
  }
}
