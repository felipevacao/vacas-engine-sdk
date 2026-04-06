import { apiError } from '@utils/error'
import { getClientIP } from '@utils/ip'
import { ResponseHandler } from '@utils/responseHandler'
import { Request, Response, NextFunction } from 'express'
import { cryptoUtils } from '@utils/crypto'
import { stringUtils } from '@utils/string'
import { SessionType, UserStatusType } from '@app-types/entity'
import { AuthUserSessionWorkflow } from '@workflows/AuthUserSession'

const authUserSessionWorkflow = new AuthUserSessionWorkflow()

export const tokenMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {

	try {
		const token = cryptoUtils.verificaHeaderToken(req)
		req.session = await authUserSessionWorkflow.validateSessionUser(token, getClientIP(req))

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
		const session = await authUserSessionWorkflow.activateResetSession(token, getClientIP(req))
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
		req.session = await authUserSessionWorkflow.validateSessionUser(token, getClientIP(req), SessionType.RESET, UserStatusType.RESET)
		next()
	} catch (error) {
		cryptoUtils.handleTokenError(error as apiError, res)
	}

}




