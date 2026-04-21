import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import env from '@libs/env';
import { ApiClientInterface, LoginResponse, UserSession, ApiResponse } from '@interfaces';

export class TreisClient implements ApiClientInterface {
  private client: AxiosInstance;
  private session: UserSession | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: env.TREIS_API_URL,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': env.INTERNAL_API_KEY,
      },
    });

    // Interceptor para injetar o token Bearer em cada requisição
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        if (this.session?.token) {
          config.headers.Authorization = `Bearer ${this.session.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Interceptor para tratar expiração de token (opcional, mas recomendado)
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Lógica de logout ou refresh poderia ser disparada aqui
          this.session = null;
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Realiza login no Treis e armazena a sessão
   */
  async login(email: string, password: string): Promise<UserSession> {
    const response = await this.client.post<LoginResponse>('/auth/login', {
      email,
      password,
    });

    if (response.data.success) {
      this.session = response.data.data;
      return this.session;
    }

    throw new Error(response.data.message || 'Falha na autenticação');
  }

  /**
   * Retorna a sessão atual
   */
  getSession(): UserSession | null {
    return this.session;
  }

  /**
   * Verifica se o token está expirado
   */
  isTokenExpired(): boolean {
    if (!this.session) return true;
    return Date.now() >= this.session.expiresAt;
  }

  async get<T>(url: string, params?: unknown): Promise<T> {
    const response = await this.client.get<ApiResponse<T>>(url, { params });
    return response.data.data;
  }

  async post<T>(url: string, data?: unknown): Promise<T> {
    const response = await this.client.post<ApiResponse<T>>(url, data);
    return response.data.data;
  }

  async put<T>(url: string, data?: unknown): Promise<T> {
    const response = await this.client.put<ApiResponse<T>>(url, data);
    return response.data.data;
  }

  async delete<T>(url: string): Promise<T> {
    const response = await this.client.delete<ApiResponse<T>>(url);
    return response.data.data;
  }
}
