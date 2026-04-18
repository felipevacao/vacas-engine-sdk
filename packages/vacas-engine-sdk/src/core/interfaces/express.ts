import session from 'express-session'
import { UserStatus } from '@app-types'

declare module 'express-session' {
  interface SessionData {
    sessionId?: string
    userId?: number
    userStatus?: UserStatus
    email?: string,
    expiresAt?: Date
  }
}

declare module 'express-serve-static-core' {
  interface Request {
    session: session.Session & session.SessionData
    clientIP?: string // Adiciona o campo clientIP ao objeto Request
  }
}

