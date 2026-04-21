export interface UserSession {
  token: string;
  expiresAt: number; // Timestamp
  // user: {
  //   id: number;
  //   name: string;
  //   email: string;
  //   login: string;
  // };
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: UserSession;
}
