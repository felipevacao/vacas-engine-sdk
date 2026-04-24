import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import env from '../libs/env';
import { authService } from '../libs/auth';
import { ApiClientInterface, UserSession, ApiResponse } from '@interfaces';
import { VeronaError } from '../libs/errors';

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
      (error: AxiosError<ApiResponse<unknown>>) => {
        const message = error.response?.data?.error?.message || error.message;
        const code = error.response?.data?.error?.code;
        return Promise.reject(new VeronaError(message, code, error.response?.data));
      }
    );
  }

  // ... (rest of methods remain the same, wrapped in try/catch or just promise rejection)
  async login(email: string, password: string): Promise<UserSession> {
    try {
      const response = await this.client.post<ApiResponse<UserSession>>('/auth/login', { email, password });
      const data = response.data;
      if (data.success) {
        const session = data.data as UserSession;
        authService.setSession(session);
        return session;
      }
      throw new VeronaError(data.message);
    } catch (e: any) {
      if (e instanceof VeronaError) throw e;
      throw new VeronaError(e.message);
    }
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
