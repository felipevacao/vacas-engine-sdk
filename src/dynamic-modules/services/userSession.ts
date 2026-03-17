import { BaseServices } from "@services/baseServices";
import { UserSessionsEntity } from "@dynamic-modules/entities/userSessions";
import { UserSessionsController } from "@dynamic-modules/controllers/userSessions";
import { cryptoUtils } from "@utils/crypto"
import { TokenType, TokenSessionType } from "types/token"
import { apiError } from "@utils/error";
import { MESSAGES } from "@constants/messages";
import {
	CreateData,
	QueryFields,
	UserStatus,
	UpdateData,
	OutputData
} from "types/entity";

export class UserSessionService
	extends BaseServices<UserSessionsEntity, UserSessionsController> {

	public id: string = ''

	constructor(
		protected entityController: UserSessionsController = new UserSessionsController()
	) {
		super(entityController)
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



}