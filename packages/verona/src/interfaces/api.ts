import { UserSession } from "./auth"

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  meta?: Record<string, unknown>;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface ApiClientInterface {
	login(email: string, password: string): Promise<UserSession>
	getSession(): UserSession | null
	isTokenExpired(): boolean
	get<T>(url: string, params?: unknown): Promise<T>
	post<T>(url: string, data?: unknown): Promise<T>
	put<T>(url: string, data?: unknown): Promise<T>
	patch<T>(url: string, data?: unknown): Promise<T>
	delete<T>(url: string): Promise<T>
}
