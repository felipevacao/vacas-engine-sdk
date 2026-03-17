// import { SessionController } from '@controllers/SessionController'
// import { UsersController } from '@dynamic-modules/controllers/users'
// import { apiError } from '@utils/error'
// import { MESSAGES } from '@constants/messages'
// import { Session, SessionData } from 'express-session'
// import { SessionType, UpdateData, UserStatusType } from 'types/entity'
// import { UsersEntity } from '@dynamic-modules/entities/users'

// export class SessionService {

// 	constructor(
// 		private sessionController = new SessionController(),
// 		private usersController = new UsersController()
// 	) { }

// 	async validateSessionUser(
// 		token: string,
// 		ip: string,
// 		sessionType: SessionType = SessionType.ACTIVE,
// 		userType: UserStatusType = UserStatusType.ACTIVE
// 	): Promise<Session & SessionData> {

// 		const session = await this.sessionController.validateUserSession(token, ip, sessionType)
// 		if (!session) {
// 			throw new apiError(MESSAGES.ERROR.INVALID_SESSION, 401)
// 		}

// 		const user = await this.usersController.findByIdEntity(session.userId, { filters: [this.usersController.getFilterUserStatus(userType)] })
// 		if (!user) {
// 			await this.sessionController.deleteSession(session.id)
// 			throw new apiError(MESSAGES.ERROR.INVALID_SESSION, 401)
// 		}

// 		return {
// 			sessionId: session.id,
// 			expiresAt: session.expiresAt,
// 			userId: user.id as number,
// 			email: user.email
// 		} as Session & SessionData

// 	}

// 	async activateResetSession(
// 		token: string,
// 		ip: string
// 	): Promise<Session & SessionData> {

// 		const session = await this.validateSessionUser(token, ip, SessionType.RESET, UserStatusType.ACTIVE)

// 		await this.usersController.updateEntity(session.userId as number, { status: UserStatusType.RESET } as UpdateData<UsersEntity>)

// 		return session
// 	}

// }