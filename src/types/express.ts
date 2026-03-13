import session from 'express-session';
import { UserStatus } from './entity';

declare module 'express-session' {
  interface SessionData {
    sessionId?: string;
    userId?: number;
    userStatus?: UserStatus
  }
}

declare module 'express-serve-static-core' {
  interface Request {
    session: session.Session & Partial<session.SessionData>;
    clientIP?: string; // Adiciona o campo clientIP ao objeto Request
  }
}

