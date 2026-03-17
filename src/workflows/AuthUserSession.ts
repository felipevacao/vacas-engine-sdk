import { UserSessionsEntity } from "@dynamic-modules/entities/userSessions";
import { UserSessionService } from "@dynamic-modules/services/userSession";
import { UserService } from "@dynamic-modules/services/user";
import { QueryFields, UserStatus } from "types/entity";

export class AuthUserSessionWorkflow {

	constructor(
		private userService: UserService = new UserService(),
		private userSessionService: UserSessionService = new UserSessionService()
	) {

	}

	async setUser(
		userId: number
	): Promise<this> {
		await this.userService.withId(userId).getEntity()
		return this
	}

	async createSession(
		ipAddress: string,
		expiresAt: Date,
		status: UserStatus = "active"
	) {
		this.userSessionService.createUserSession(
			this.userService.entity?.id as number,
			ipAddress,
			expiresAt,
			status
		)
	}

	async verifyPreviousActiveUserSession(
		ipAddress: string,
		status: UserStatus = "active"
	): Promise<boolean> {

		const options = {
			where: {
				user_id: this.userService.entity?.id,
				ip_address: ipAddress,
				is_revoked: false,
				status
			},
			filters: [{
				field: 'expires_at',
				operator: '>',
				value: new Date()
			}]
		} as QueryFields<UserSessionsEntity>

		const userSessions = await this.userSessionService.getUserSessionByOptions(options)
		if (userSessions) {
			return true
		}
		return false
	}

	async revokeAllUserSessions() {
		const options = {
			where: {
				user_id: this.userService.entity?.id,
				is_revoked: false,
			},
			filters: [{
				field: 'expires_at',
				operator: '>',
				value: new Date()
			}]
		} as QueryFields<UserSessionsEntity>

		const userSessions = await this.userSessionService.getUserSessionByOptions(options)
		if (userSessions) {
			if (Array.isArray(userSessions)) { // EXECUTAR EM ASYNC AWAIT - TALVEZ USAR FOR
				userSessions.forEach((userSession) => {
					this.userSessionService.revokeSession(userSession.id)
				})
			}
		}
	}
}