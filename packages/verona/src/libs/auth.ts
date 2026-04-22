import { UserSession, ApiResponse } from '../interfaces/index';
import env from './env';
import axios from 'axios';

class AuthService {
  private session: UserSession | null = null;
  private refreshPromise: any = null;

  setSession(session: UserSession | null) {
    if (session && typeof session.expiresAt === 'string') {
        session.expiresAt = new Date(session.expiresAt).getTime();
    }
    this.session = session;
  }

  getSession(): UserSession | null {
    return this.session;
  }

  isTokenExpired(): boolean {
    if (!this.session) return true;
    return Date.now() >= ((this.session.expiresAt as number) - 60000);
  }

  async refresh(): Promise<UserSession> {
    if (this.refreshPromise) return this.refreshPromise;

    this.refreshPromise = axios.get(`${env.TREIS_API_URL}/auth/refresh`, {
      headers: { Authorization: `Bearer ${this.session?.token}` }
    }).then((res: any) => {
      const data = res.data as ApiResponse<UserSession>;
      this.session = data.data;
      this.refreshPromise = null;
      return this.session!;
    }).catch(err => {
      this.session = null;
      this.refreshPromise = null;
      throw err;
    });

    return this.refreshPromise;
  }
}

export const authService = new AuthService();
