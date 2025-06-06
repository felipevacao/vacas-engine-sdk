import session from 'express-session';

declare module 'express-session' {
  interface SessionData {
    userId?: string;
    // Adicione outros campos conforme necessário
  }
}

declare module 'express-serve-static-core' {
  interface Request {
    session: session.Session & Partial<session.SessionData>;
  }
}