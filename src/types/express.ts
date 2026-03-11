import session from 'express-session';

declare module 'express-session' {
  interface SessionData {
    sessionId?: string;
    userId?: number;
    // Adicione outros campos conforme necessário
  }
}

declare module 'express-serve-static-core' {
  interface Request {
    session: session.Session & Partial<session.SessionData>;
    clientIP?: string; // Adiciona o campo clientIP ao objeto Request
  }
}