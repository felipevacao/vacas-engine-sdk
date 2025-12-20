import { ERROR_CODES } from '@constants/errorCodes'
import { SessionController } from '@controllers/SessionController'
import { ResponseHandler } from '@utils/responseHandler'
import { Request, Response, NextFunction } from 'express'
import { Session, SessionData } from 'express-session'

/** * Middleware to validate the authentication token.
 * It checks if the token is present in the request headers,
 * validates it, and attaches the session information to the request object.
 * If the token is missing or invalid, it responds with an error.
 */
export const tokenMiddleware = async (
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> => {

  const authHeader = req.headers.authorization
  
  // 1. Verificar se o token foi enviado
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      error: 'Token de autenticação não fornecido',
      code: 'MISSING_TOKEN'
    })
    return
  }

  const token = authHeader?.split(' ')[1]
  if (!token) {
    res.status(401).json({
      success: false,
      error: 'Token não fornecido',
      code: 'MISSING_TOKEN'
    })
  }

    try {
        // 2. Validar o token
        const sessionController = new SessionController()
        const [ user, session ] = await sessionController.validateUser(token as string, '127.0.0.1')
        if(!session || !user) {
            res.status(401).json({
                success: false,
                error: 'Sessão inválida ou usuário não encontrado',
                code: 'INVALID_SESSION'
            })
        }
        
          req.session = {
            sessionId: session.id,
            userId: user.id as number,
          } as Session & Partial<SessionData>

        next()

    }catch (error) {
        handleTokenError(error as Error, res)
        
    }
  

/**
 * Handle token validation errors.
 * @param error - The error object.
 * @param res - The Express response object.
 */
function handleTokenError(
  error: Error, 
  res: Response
) {    
  if (error.name === 'InvalidSessionError') {
    return ResponseHandler.error(
        res,
        'Sessão inválida',
        ERROR_CODES.INVALID_SESSION,
        401
    )
  }

  return ResponseHandler.error(
      res,
      'Erro durante a validação do token',
      ERROR_CODES.INTERNAL_ERROR,
      500,
      error as Error
  )
}

}