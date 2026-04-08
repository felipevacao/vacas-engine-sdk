import { HttpStatus } from '@constants/HttpStatus';
import { MESSAGES } from '@constants/messages';
import { UsersRolesService } from './roles.service';
import { Request, Response, NextFunction } from 'express'
import { ResponseHandler } from '@utils/responseHandler'


export const verifyAdmin = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {

	const user = await new UsersRolesService(req.session.userId as number).setEntity()
	if (user.isAdmin()) {
		next()
		return
	}

	ResponseHandler.error(res, MESSAGES.ERROR.INVALID_CREDENTIALS, HttpStatus.UNAUTHORIZED)
}

export const verifySameUser = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {

	const user = await new UsersRolesService(req.session.userId as number).setEntity()
	if (user.isAdmin()) {
		next()
		return
	}

	const id = parseInt(req.params.id as string)
	if (id) {
		if (id === req.session.userId) {
			next()
			return
		}
	}

	ResponseHandler.error(res, MESSAGES.ERROR.INVALID_CREDENTIALS, HttpStatus.UNAUTHORIZED)
}