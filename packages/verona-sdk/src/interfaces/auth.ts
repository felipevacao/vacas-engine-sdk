export interface UserSession {
  token: string;
  expiresAt: string | number; // String ISO ou timestamp
}

export interface LoginResponse {
  data: UserSession;
}
