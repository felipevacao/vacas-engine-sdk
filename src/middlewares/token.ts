import { SessionController } from '@controllers/SessionController';
import { Request, Response, NextFunction } from 'express';
import { Session, SessionData } from 'express-session';

export const tokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  // 1. Verificar se o token foi enviado
  if (!authHeader || !authHeader.startsWith('Bearer ')) {

    return res.status(401).json({
      success: false,
      error: 'Token de autenticação não fornecido',
      code: 'MISSING_TOKEN'
    });
  }

  const token = authHeader?.split(' ')[1];
  if(token){
    try {
        // 2. Validar o token
        const sessionController = new SessionController();
        const [ user, session ] = await sessionController.validateUser(token, '127.0.0.1');
        if(!session || !user) {
            res.status(401).json({
                success: false,
                error: 'Sessão inválida ou usuário não encontrado',
                code: 'INVALID_SESSION'
            });
            return
        }
        
        if(session){
          req.session = {
            id: session.id,
          } as Session & Partial<SessionData>;
        }

        next()

    }catch (error) {
        handleTokenError(error as Error, res);
    }
  }


function handleTokenError(error: Error, res: Response) {  console.error('Erro na validação do token:', error);
  
  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: 'Token expirado',
      code: 'TOKEN_EXPIRED'
    });
  }

  res.status(500).json({
    success: false,
    error: 'Erro durante a validação do token',
    code: 'SERVER_ERROR'
  });
}

}