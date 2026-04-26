import { UserSessionsEntity, UserSessionService } from "@core-modules/userSessions";
import { UserService, UsersEntity, UsersRolesService } from "@core/modules/users";
import { MESSAGES, HttpStatus } from "@constants";
import { InputRequest } from "@interfaces";
import { AuthService } from "@services";
import { apiError } from "@utils";
import {
	LoginRequest,
	OutputData,
	QueryFields,
	SessionType,
	UpdateData,
	UserStatus,
	UserStatusType,
	TokenSessionType
} from "@app-types";
import env from "@libs/env";
import session from "express-session";

export class AuthUserSessionWorkflow {

	private resetSessionExpireMinutes: number = 10

	constructor(
		private userService: UserService = new UserService(),
		private userSessionService: UserSessionService = new UserSessionService(),
		private authService: AuthService = new AuthService()
	) {

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

		const sessionList = await this.returnPreviousUserSession(ipAddress, status,)
		if (Array.isArray(sessionList)) {
			for (const session of sessionList) {
				if (this.userSessionService.validateToken(token, session.tokenHash)) {
					return await this.userSessionService.updateEntity(session.id, session)
				}
			}
		}
		throw new apiError(
			MESSAGES.DATABASE.LOGIN.INVALID_SESSION,
			HttpStatus.UNAUTHORIZED,
			this.userSessionService.getContext()
		)

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
		user_id: string | number | undefined = undefined
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

	private async revokeAllUserSessions(): Promise<void> {

		try {
			const userSessions = await this.returnPreviousUserSession(null, null, this.userService.getEntity().id)
			if (userSessions) {
				if (Array.isArray(userSessions)) {
					const promises = userSessions.map(userSession =>
						this.userSessionService.revokeSession(userSession.id)
					)
					await Promise.all(promises)
				}
			}
		} catch (error) {
			throw error;
		}

	}

	async validateSessionUser(
		token: string,
		ip: string,
		sessionType: SessionType = SessionType.ACTIVE,
		userType: UserStatusType = UserStatusType.ACTIVE
	): Promise<session.Session & Partial<session.SessionData>> {

		const session = await this.validateUserSession(token, ip, sessionType,)
		if (!session) {
			throw new apiError(MESSAGES.ERROR.INVALID_SESSION, 403)
		}

		const user = await this.userService.findByIdEntity(session.userId, { filters: [this.userService.getFilterUserStatus(userType)] })
		if (!user) {
			await this.userSessionService.revokeSession(session.id)
			throw new apiError(
				MESSAGES.ERROR.INVALID_SESSION,
				HttpStatus.FORBIDDEN,
				this.userService.getContext()
			)
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

		await this.userService.withId(session.userId as number).setEntity()
		await this.userService.updateStatus(UserStatusType.RESET)

		return session
	}

	async verifyUserPassword(
		email: string,
		password: string
	): Promise<boolean> {
		const dummyHash = "$2b$12$R9h/cIPz0gi.URNNX3kh2OPST9/zBkqquzaY8vL9x.330n0/2Z7.y";
		const dummyPepper = 1;
		try {
			await this.userService.getUserByEmail(email)
			const user = this.userService.getEntity()
			const [match, pepper] = await this.authService.comparePassword(password, user.password, parseInt(user.pepper))
			if (!match) {
				throw new Error
			}

			if (this.authService.verifyUserPepperVersion(pepper)) {
				await this.updatePassword(password)
			}

			return match

		} catch {
			await this.authService.comparePassword(password, dummyHash, dummyPepper);
			throw new apiError(MESSAGES.ERROR.INVALID_LOGIN, HttpStatus.UNAUTHORIZED, this.userService.getContext())
		}
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
		userId: number,
		currentPassword: string,
		newPassword: string
	) {
		try {
			await this.userService.withId(userId).setEntity({ fields: ['*'] })

			const user = this.userService.getEntity()
			if (user.status === 'active') {
				const [match] = await this.authService.comparePassword(currentPassword, user.password, parseInt(user.pepper))
				if (!match) {
					throw new apiError(MESSAGES.ERROR.INVALID_LOGIN, 403)
				}
				await this.updatePassword(newPassword)
			}
			throw new apiError(MESSAGES.ERROR.INVALID_LOGIN, 403)
		} catch (error) {
			throw error
		}

	}

	async resetPasswordSession(
		email: string,
		ipAddress: string
	): Promise<TokenSessionType> {
		try {
			await this.userService.getUserByEmail(email)
			const session = this.createResetSession(ipAddress)
			return session
		} catch (error) {
			throw error
		}
	}

	async resetPassword(
		sessionId: string,
		userId: number,
		email: string,
		newPassword: string
	) {
		try {
			await this.userSessionService.withId(sessionId).setEntity()
			await this.userService.withId(userId).setEntity()

			if (this.userSessionService.getEntity().status !== UserStatusType.RESET) {
				await this.revokeAllUserSessions()
				throw new apiError(MESSAGES.ERROR.TOKEN_VALIDATION_ERROR, 403)
			}

			if (this.userService.getEntity().status !== UserStatusType.RESET) {
				await this.revokeAllUserSessions()
				throw new apiError(MESSAGES.ERROR.TOKEN_VALIDATION_ERROR, 403)
			}

			if (this.userService.getEntity().email !== email) {
				await this.revokeAllUserSessions()
				throw new apiError(MESSAGES.ERROR.TOKEN_VALIDATION_ERROR, 403)
			}

			await this.updatePassword(newPassword)
			await this.userService.updateStatus(UserStatusType.ACTIVE)
			await this.revokeAllUserSessions()

		} catch (error) {
			throw error
		}
	}

	async updatePassword(
		newPassword: string
	) {
		try {
			const entity = this.userService.getEntity()
			this.userService.contextDetail(`userId: ${entity?.id}`)
			if (entity.id) {
				const { passwordHash, pepper } = await this.authService.generateHash(newPassword)
				entity.password = passwordHash
				entity.pepper = pepper.toString()
				await this.userService.updateEntity(entity.id, entity)
			}
		} catch {
			throw new apiError(MESSAGES.DATABASE.ENTITY.UPDATE_ERROR)
		}
	}

	async updateUserStatus(
		userId: number,
		status: UserStatusType
	) {
		try {
			await this.userService.withId(userId).setEntity()
			await this.userService.updateStatus(status)
		} catch (error) {

			this.userService.contextDetail(JSON.stringify(error))

			throw new apiError(MESSAGES.DATABASE.ENTITY.UPDATE_ERROR, 500, this.userService.getContext())
		}
	}

	async resetSession(
		sessionId: string
	) {
		try {
			await this.userSessionService.withId(sessionId).setEntity()
			await this.userSessionService.revoke()
			const session = this.userSessionService.getEntity()
			await this.userService.withId(session.userId).setEntity()
			return await this.createRegularSession(session.ipAddress)
		} catch (error) {
			throw error
		}
	}

	validateLoginFields(
		input: unknown
	): [email: string, password: string] {

		if (!input || typeof input !== 'object') {
			throw new apiError(MESSAGES.ERROR.INVALID_FORMAT)
		}
		const { email, password } = input as LoginRequest
		if (!email || !password) {
			throw new apiError(MESSAGES.ERROR.INVALID_FORMAT)
		}

		return [email, password]
	}

	async register(
		userData: Partial<UsersEntity>,
		ipAddress: string
	): Promise<TokenSessionType> {
		try {
			// Verifica se já existem usuários no sistema
			const usersCount = await this.userService.countAll();

			// Se já existirem usuários E o registro público estiver desativado, bloqueia
			if (usersCount > 0 && !env.ENABLE_PUBLIC_REGISTRATION) {
				throw new apiError(MESSAGES.ERROR.OPERATION_ERROR, HttpStatus.FORBIDDEN, this.userService.getContext())
			}

			// Se for o primeiro usuário, ele vira admin automaticamente

			if (usersCount === 0) {
				userData.role = 'admin';
				userData.status = 'active';
			} else {
				// Se não for o primeiro, segue o padrão ou regra de negócio
				userData.role = userData.role || 'regular';
				userData.status = userData.status || 'active';
			}

			// Gera o hash da senha usando o AuthService (e o pepper atual do env)
			const { passwordHash, pepper } = await this.authService.generateHash(userData.password as string);
			userData.password = passwordHash;
			userData.pepper = pepper.toString();

			// Cria o usuário no banco
			const newUser = await this.userService.createEntity(userData as UsersEntity);

			// Carrega a entidade no workflow para criar a sessão
			await this.userService.withId(newUser.id as number).setEntity();

			// Cria a sessão inicial
			return await this.createRegularSession(ipAddress);
		} catch (error) {
			throw error;
		}
	}

	async validateUpdate(
		id: number,
		input: InputRequest<Request>,
		userSession: number | null = null
	): Promise<UpdateData<UsersEntity>> {

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { pepper, password, ...rest } = input.body as UpdateData<UsersEntity>;

		if (userSession) {
			const user = await new UsersRolesService(userSession as number).setEntity()
			if (user.isAdmin()) {
				return rest as UpdateData<UsersEntity>;
			}
		}
		return await this.userService.withId(id).generateBodyUpdate(input) ?? rest as UpdateData<UsersEntity>;

	}

}