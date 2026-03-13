import { MESSAGES } from '@constants/messages/index'
import { SessionController } from '@controllers/SessionController'
import { UsersController } from '@dynamic-modules/controllers/users'
import { apiError } from '@utils/error'
import { getClientIP } from '@utils/ip'
import { ResponseHandler } from '@utils/responseHandler'
import { Request, Response, NextFunction } from 'express'
import { Session, SessionData } from 'express-session'
import { cryptoUtils } from '@utils/crypto'

const sessionController = new SessionController()
const usersController = new UsersController()

export const tokenMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {

	try {
		const token = cryptoUtils.verificaHeaderToken(req)

		const session = await sessionController.validateUserSession(token, getClientIP(req))
		if (!session) {
			throw new apiError(MESSAGES.ERROR.INVALID_SESSION, 'INVALID_SESSIONS', 401)
		}
		
		const user = await usersController.findByIdEntity(session.userId)
		if (!user) {
			throw new apiError(MESSAGES.ERROR.INVALID_SESSION, 'INVALID_SESSIONS', 401)
		}
		
		req.session = {
			sessionId: session.id,
			userId: user.id as number,
		} as Session & Partial<SessionData>

		next()

	} catch (error) {
		cryptoUtils.handleTokenError(error as apiError, res)
	}

}

/**
 * Verifica se o token para reset de senha está ativo
 */
export const checkExistingResetToken = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {

		try {
			const token = cryptoUtils.verificaHeaderToken(req)
			
			const session= await sessionController.validateUserSession(token as string, getClientIP(req), 'reset_required')
			if (session) {
				const user = await usersController.findByIdEntity(session.userId)
				if (user) {
					const response = {
						mensagem: MESSAGES.DATABASE.LOGIN.ACTIVE_SESSION,
						expiresAt: session.expiresAt,
					}
					ResponseHandler.success(res, response, 'Token válido')
				}
			}

		} catch (error) {
			cryptoUtils.handleTokenError(error as apiError, res)
		}

	next()

}

/**
 * 
 * Middleware para validar o token de reset de senha
 */
export const resetTokenMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {

	try {
		const token = cryptoUtils.verificaHeaderToken(req)
		
		const session = await sessionController.validateUserSession(token as string, req.ip || '127.0.0.1', 'reset_required')

		const user = await usersController.findByIdEntity(session.userId)
		if (!user) {
			throw new apiError(MESSAGES.ERROR.INVALID_SESSION, 'INVALID_SESSIONS', 401)
		}

		req.session = {
			sessionId: session.id,
			userId: user.id as number,
			userStatus: user.status
		} as Session & Partial<SessionData>

		await usersController.updateEntity(user.id as number, { ...user, status: 'reset_required' }, {})

		next()

	} catch (error) {
		cryptoUtils.handleTokenError(error as apiError, res)

	}

}



