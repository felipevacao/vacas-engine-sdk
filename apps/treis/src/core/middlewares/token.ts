import { AuthUserSessionWorkflow } from '@workflows'
import { apiError, cryptoUtils, stringUtils, ResponseHandler, getClientIP } from '@utils'
import { Request, Response, NextFunction } from 'express'
import { SessionType, UserStatusType } from '@app-types'
import { UserService } from '@core/modules/users';

const userService = new UserService()
const authUserSessionWorkflow = new AuthUserSessionWorkflow(userService)

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




