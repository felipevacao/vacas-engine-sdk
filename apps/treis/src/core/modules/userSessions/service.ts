import { BaseServices, ServiceFactory } from "@services";
import { UserSessionsEntity } from "./entity";
import { UserSessionsController } from "./controller";
import { cryptoUtils, apiError } from "@utils"
import { TokenType, TokenSessionType } from "@app-types"
import { MESSAGES } from "@constants";
import {
	CreateData,
	QueryFields,
	UserStatus,
	UpdateData,
	OutputData
} from "@app-types";
import { BaseController } from "@controllers";


export class UserSessionService
	extends BaseServices<UserSessionsEntity, UserSessionsController> {

	constructor(
		protected entityController: UserSessionsController = new UserSessionsController()
	) {
		super(entityController)
	}

	override async updateEntity(
		...args: Parameters<BaseController<UserSessionsEntity>['updateEntity']>
	): Promise<Awaited<ReturnType<BaseController<UserSessionsEntity>['updateEntity']>>> {
		args[1].lastUsedAt = new Date()
		return await this.getController().updateEntity(args[0], args[1], args[2])
	}

	async createUserSession(
		userId: number,
		ipAddress: string,
		expiresAt: Date,
		status: UserStatus = "active"
	): Promise<TokenSessionType> {

		this.contextDetail(`userId: ${userId}`)
		this.contextDetail(`ipAddress: ${ipAddress}`)
		this.contextDetail(`status: ${status}`)

		const generatedToken = this.createToken()
		if (!generatedToken.token || !generatedToken.hash) {
			this.contextDetail(`generatedToken: ${MESSAGES.ERROR.INVALID_FORMAT}`)
		}

		const userSession = await this.entityController.createEntity({
			userId: userId,
			tokenHash: generatedToken.hash,
			expiresAt: expiresAt,
			ipAddress: ipAddress,
			status: status
		} as CreateData<UserSessionsEntity>)

		if (!userSession) {
			throw new apiError(MESSAGES.ERROR.OPERATION_ERROR, 500, this.getContext())
		}

		return {
			token: generatedToken.token,
			expiresAt: expiresAt
		}
	}

	async getUserSessionByOptions(
		options: QueryFields<UserSessionsEntity>
	): Promise<UserSessionsEntity[] | boolean> {
		const userSessions = await this.entityController.findByEntity(options)
		if (userSessions) {
			return userSessions
		}
		return false
	}

	async revokeSession(
		sessionId: string
	): Promise<OutputData<UserSessionsEntity>> {
		this.contextDetail(`revoke ${sessionId}`)
		this.validateId(sessionId)
		const updatedSession = await this.entityController.updateEntity(
			sessionId,
			{
				isRevoked: true,
				lastUsedAt: new Date()
			} as UpdateData<UserSessionsEntity>
		)
		return updatedSession
	}

	async revoke(): Promise<this> {
		await this.revokeSession(this.getEntity().id)
		return this
	}

	createToken(): TokenType {

		const token = cryptoUtils.generateToken()
		const hash = cryptoUtils.hashToken(token)

		return {
			token,
			hash
		}
	}

	validateToken(
		token: string,
		hash: string
	): boolean {
		return cryptoUtils.verifyToken(token, hash)
	}

	setExpiresAtDate(minutes: number): Date {
		return cryptoUtils.getExpiresAt(minutes)
	}

}

ServiceFactory.register('user_sessions', () => new UserSessionService());