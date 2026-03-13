import { apiError } from '@utils/error'
import { getClientIP } from '@utils/ip'
import { ResponseHandler } from '@utils/responseHandler'
import { Request, Response, NextFunction } from 'express'
import { cryptoUtils } from '@utils/crypto'
import { stringUtils } from '@utils/string'
import { SessionService } from '@services/auth/session'
import { SessionType, UserStatusType } from 'types/entity'

const sessionService = new SessionService()

export const tokenMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {

	try {
		const token = cryptoUtils.verificaHeaderToken(req)
		req.session = await sessionService.validateSessionUser(token, getClientIP(req))
		next()
	} catch (error) {
		cryptoUtils.handleTokenError(error as apiError, res)
	}

}

export const checkExistingResetToken = async (
	req: Request,
	res: Response
): Promise<void> => {

	try {
		const token = cryptoUtils.verificaParamToken(req)
		const session = await sessionService.activateResetSession(token, getClientIP(req))
		const response = {
			email: stringUtils.maskEmail(session.email as string),
			expiresAt: session.expiresAt,
		}
		ResponseHandler.success(res, response)
	} catch (error) {
		cryptoUtils.handleTokenError(error as apiError, res)
	}

}

export const resetTokenMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {

	try {
		const token = cryptoUtils.verificaHeaderToken(req)
		req.session = await sessionService.validateSessionUser(token, getClientIP(req), SessionType.RESET, UserStatusType.RESET)
		next()
	} catch (error) {
		cryptoUtils.handleTokenError(error as apiError, res)
	}

}




