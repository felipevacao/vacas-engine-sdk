// import { UserService } from '@dynamic-modules/services/users'
import { HttpStatus } from '@constants/HttpStatus';
import { MESSAGES } from '@constants/messages';
import { UsersRolesService } from '@dynamic-modules/services/users.roles';
import { Request, Response, NextFunction } from 'express'
import { ResponseHandler } from '@utils/responseHandler'


// const UserService = new UserService()

export const verifyAdmin = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {

	const user = await new UsersRolesService(req.session.userId as number).setEntity()
	if (user.isAdmin()) {
		next()
	}

	ResponseHandler.error(res, MESSAGES.ERROR.INVALID_CREDENTIALS, HttpStatus.UNAUTHORIZED)
}