import { UserSessionsEntity } from "@dynamic-modules/entities/userSessions";
import { UserSessionService } from "@dynamic-modules/services/userSession";
import { UserService } from "@dynamic-modules/services/user";
import { apiError } from "@utils/error";
import { MESSAGES } from "@constants/messages";
import session from "express-session";
import { UsersEntity } from "@dynamic-modules/entities/users";
import {
	OutputData,
	QueryFields,
	SessionType,
	UpdateData,
	UserStatus,
	UserStatusType
} from "types/entity";
import { AuthService } from "@services/auth";
import { BaseWorkflow } from "./base";
import { TokenSessionType } from "types/token";

export class AuthUserSessionWorkflow extends BaseWorkflow {

	private resetSessionExpireMinutes: number = 10

	constructor(
		private userService: UserService = new UserService(),
		private userSessionService: UserSessionService = new UserSessionService(),
		private authService: AuthService = new AuthService()
	) {
		super()
	}

	async setUser(
		userId: number
	): Promise<this> {
		await this.userService.withId(userId).setEntity()
		return this
	}

	async validateUserSession(
		token: string,
		ipAddress: string,
		status: UserStatus = 'active'
	): Promise<OutputData<UserSessionsEntity>> {
		const sessionList = this.returnPreviousUserSession(ipAddress, status)
		if (Array.isArray(sessionList)) {
			for (const session of sessionList) {
				if (this.userSessionService.validateToken(token, session.tokenHash)) {
					return await this.userSessionService.updateEntity(session.id, session, {})
				}
			}
		}
		throw new apiError(MESSAGES.DATABASE.LOGIN.INVALID_SESSION, 401)
	}

	private async createSession(
		ipAddress: string,
		expiresAt: Date,
		status: UserStatus = "active"
	): Promise<TokenSessionType> {
		return this.userSessionService.createUserSession(
			this.userService.getEntity().id as number,
			ipAddress,
			expiresAt,
			status
		)
	}

	async createRegularSession(
		ipAddress: string,
	): Promise<TokenSessionType> {
		return await this.createSession(
			ipAddress,
			this.userSessionService.setExpiresAtDate(this.userService.getExpiresAtMinutes())
		)
	}

	async createResetSession(
		ipAddress: string,
	): Promise<TokenSessionType> {
		return await this.createSession(
			ipAddress,
			this.userSessionService.setExpiresAtDate(this.resetSessionExpireMinutes),
			'reset_required'
		)
	}

	private async returnPreviousUserSession(
		ipAddress: string | null = null,
		status: UserStatus | null = null,
		user_id: string | number | undefined = this.userService.getEntity().id
	): Promise<UserSessionsEntity[] | boolean> {

		const options = {
			where: {
				is_revoked: false,
				...(status && { status }),
				...(ipAddress && { ip_address: ipAddress }),
				...(user_id && { user_id })
			},
			filters: [{
				field: 'expires_at',
				operator: '>',
				value: new Date()
			}]
		} as QueryFields<UserSessionsEntity>

		return await this.userSessionService.getUserSessionByOptions(options)
	}

	async verifyPreviousUserSession(
		ipAddress: string,
		status: UserStatus = "active"
	): Promise<boolean> {
		const userSessions = await this.returnPreviousUserSession(ipAddress, status)
		if (userSessions) {
			return true
		}
		return false
	}

	async verifyPreviousActiveUserSession(
		ipAddress: string
	): Promise<boolean> {
		return await this.verifyPreviousUserSession(ipAddress, 'active')
	}

	private async revokeAllUserSessions() {
		const userSessions = await this.returnPreviousUserSession()
		if (userSessions) {
			if (Array.isArray(userSessions)) {
				const promises = userSessions.map(userSession =>
					this.userSessionService.revokeSession(userSession.id)
				)
				await Promise.all(promises)
			}
		}
	}

	async validateSessionUser(
		token: string,
		ip: string,
		sessionType: SessionType = SessionType.ACTIVE,
		userType: UserStatusType = UserStatusType.ACTIVE
	): Promise<session.Session & Partial<session.SessionData>> {

		const session = await this.validateUserSession(token, ip, sessionType)
		if (!session) {
			throw new apiError(MESSAGES.ERROR.INVALID_SESSION, 401)
		}

		const user = await this.userService.findByIdEntity(session.userId, { filters: [this.userService.getFilterUserStatus(userType)] })
		if (!user) {
			await this.userSessionService.revokeSession(session.id)
			throw new apiError(MESSAGES.ERROR.INVALID_SESSION, 401)
		}

		return {
			sessionId: session.id,
			expiresAt: session.expiresAt,
			userStatus: user.status,
			userId: user.id as number,
			email: user.email
		} as session.Session & Partial<session.SessionData>

	}

	async activateResetSession(
		token: string,
		ip: string
	): Promise<Partial<session.SessionData>> {

		const session = await this.validateSessionUser(token, ip, SessionType.RESET, UserStatusType.ACTIVE)

		await this.userService.updateEntity(session.userId as number, { status: UserStatusType.RESET } as UpdateData<UsersEntity>)

		return session
	}

	async verifyUserPassword(
		email: string,
		password: string
	): Promise<boolean> {
		await this.userService.getUserByEmail(email)
		const user = this.userService.getEntity()
		const [match, pepper] = await this.authService.comparePassword(password, user.password, parseInt(user.pepper))

		if (!match) {
			throw new apiError(MESSAGES.ERROR.INVALID_LOGIN, 401)
		}

		if (this.authService.verifyUserPepperVersion(pepper)) {
			this.userService.updatePassword(password, this.authService.getCurrentPepperVersion())
		}

		return match
	}

	async login(
		login: string,
		password: string,
		ipAddress: string
	): Promise<TokenSessionType> {
		try {
			const email = login
			await this.verifyUserPassword(email, password)
			this.revokeAllUserSessions()
			return await this.createRegularSession(ipAddress)
		} catch (error) {
			throw error
		}
	}

	async logout(
		sessionId: string
	) {
		try {
			const session = await this.userSessionService
				.withId(sessionId)
				.setEntity()

			await session.revoke()
		} catch (error) {
			throw error
		}
	}

	async updateUserPassword(
		sessionId: string,
		userId: number,
		currentPassword: string,
		newPassword: string
	) {
		await this.userSessionService.withId(sessionId).setEntity()
		await this.userService.withId(userId).setEntity()


	}

}