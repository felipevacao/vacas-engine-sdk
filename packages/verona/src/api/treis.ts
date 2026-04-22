import axios from 'axios';
import env from '../libs/env';
import { authService } from '../libs/auth';
import { ApiClientInterface, LoginResponse, UserSession, ApiResponse } from '../interfaces';

export class TreisClient implements ApiClientInterface {
  private client: any;

  constructor(config?: { baseURL?: string; apiKey?: string }) {
    this.client = axios.create({
      baseURL: config?.baseURL || env.TREIS_API_URL,
      headers: { 'Content-Type': 'application/json', 'x-api-key': config?.apiKey || env.INTERNAL_API_KEY },
    });

    this.client.interceptors.request.use(async (config: any) => {
      if (authService.getSession()) {
        if (authService.isTokenExpired()) {
          await authService.refresh();
        }
        config.headers.Authorization = `Bearer ${authService.getSession()?.token}`;
      }
      return config;
    });

    this.client.interceptors.response.use(
      (response: any) => response,
      async (error: any) => {
        const config = error.config as any;
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
    const response = await this.client.post('/auth/login', { email, password });
    const data = response.data as ApiResponse<UserSession>;
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
    const res = await this.client.get(url, { params });
    return res.data.data as T;
  }
  async post<T>(url: string, data?: unknown): Promise<T> {
    const res = await this.client.post(url, data);
    return res.data.data as T;
  }
  async put<T>(url: string, data?: unknown): Promise<T> {
    const res = await this.client.put(url, data);
    return res.data.data as T;
  }
  async patch<T>(url: string, data?: unknown): Promise<T> {
    const res = await this.client.patch(url, data);
    return res.data.data as T;
  }
  async delete<T>(url: string): Promise<T> {
    const res = await this.client.delete(url);
    return res.data.data as T;
  }
}
