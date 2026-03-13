import { UserSessionsController } from "@dynamic-modules/controllers/userSessions"
import { cryptoUtils } from "@utils/crypto"
import { CreateData, Model, QueryFields, UpdateData, UserStatus } from "types/entity"
import { UserSessionsEntity } from "@dynamic-modules/entities/userSessions"
import { UsersController } from "@dynamic-modules/controllers/users"
import { UsersEntity } from "@dynamic-modules/entities/users"
import { hashUtils } from "@utils/hash"
import { apiError } from "@utils/error"
import { MESSAGES } from "@constants/messages"

export class SessionController {
    private userSessions: UserSessionsController
    private user: UsersController

    constructor() {
        this.userSessions = new UserSessionsController()
        this.user = new UsersController()
    }

    /**
     * Generates a new token and its hash.
     * @returns An object containing the token and its hash.
     */
    private createToken(): { token: string, hash: string } {
        const token = cryptoUtils.generateToken()
        const hash = cryptoUtils.hashToken(token)

        return { token, hash }
    }

    /**
     * Validates a token against its hash.
     * @param token The token to validate.
     * @param hash The hash to compare against.
     * @returns True if the token is valid, false otherwise.
     */
    private validateToken(
        token: string, 
        hash: string
    ): boolean {

        return cryptoUtils.verifyToken(token, hash)

    }

    /**
     * Verifies if a user has an active session.
     * @param user The user to check.
     * @param ipAddress The IP address of the user.
     * @returns True if the user has an active session, false otherwise.
     */
    private async verifySession(
        user: UsersEntity, 
        ipAddress: string
    ): Promise<UserSessionsEntity | boolean> {

        const options = {
            where: { 
                user_id: user.id,
                ip_address: ipAddress,
                is_revoked: false
            },
            filters: [{
                field: 'expires_at',
                operator: '>',
                value: new Date()
            }]
        } as QueryFields<UserSessionsEntity>

        const userSessions = await this.userSessions.findByEntity(options)

        return userSessions[0] || false

    }

    /**
     * Creates a new session for a user.
     * @param user The user to create a session for.
     * @param ipAddress The IP address of the user.
     * @returns An object containing the token.
     */
    public async createSession(
        user: UsersEntity, 
        ipAddress: string
    ): Promise<{ token: string, expiresAt: Date }> {
        /**
         * Se 
         */
        const previousSession = await this.verifySession(user, ipAddress)
        if (previousSession && typeof previousSession !== 'boolean') {
            this.deleteSession(previousSession.id)
        }
        // Generate a new token and its hash
        const { token, hash } = this.createToken()

        let expiresAt = 60
        switch (user.role) {
            case 'admin':
                expiresAt = 120
                break
            case 'guest':
                expiresAt = 5
                const options = {
                        fields: ['login' as (keyof Model<UsersEntity>)],
                        filters: [{
                            field: "role",
                            operator: "=",
                            value: "guest",
                        }]
                } as QueryFields<UsersEntity>
                const { passwordHash, pepper } = await hashUtils.generateHash(cryptoUtils.generateToken())
                this.user.updateEntity(user.id as number, { password: passwordHash, pepper: pepper } as UpdateData<UsersEntity>, options)
                break
        }
        const expiresAtDate = cryptoUtils.getExpiresAt(expiresAt)
        // Create a new session entity
        await this.userSessions.createEntity({
            userId: user.id as number,
            tokenHash: hash,
            expiresAt: expiresAtDate,
            ipAddress: ipAddress,
            status: 'active'
        } as CreateData<UserSessionsEntity>, {})

        return { token: token, expiresAt: expiresAtDate }

    }

    public async createResetSession(
        user: UsersEntity, 
        ipAddress: string
    ): Promise<{ token: string, expiresAt: Date }> {
        
        const { token, hash } = this.createToken()

        const expiresAtDate = cryptoUtils.getExpiresAt(10)
        
        await this.userSessions.createEntity({
            userId: user.id as number,
            tokenHash: hash,
            expiresAt: expiresAtDate,
            ipAddress: ipAddress,
            status: 'reset_required'
        } as CreateData<UserSessionsEntity>, {})

        return { token: token, expiresAt: expiresAtDate }

    }

    /**
     * Deletes a session by its ID.
     * @param sessionId The ID of the session to delete.
     */
    public async deleteSession(
        sessionId: string | number
    ): Promise<void> {
        
        /**
         * Marca a sessão como revogada e atualiza a data de último uso. Em seguida, verifica se existem outras sessões ativas para o mesmo usuário e as revoga também, 
         * garantindo que o usuário seja desconectado de todas as sessões ativas.
         */
        const updatedSession = await this.userSessions.updateEntity(
            sessionId,
            {
                isRevoked: true,
                lastUsedAt: new Date()
            } as UpdateData<UserSessionsEntity>,
            {})

        const notRevokedSession = await this.userSessions.findAllEntity({
            filters: [{
                field: 'is_revoked',
                operator: '=',
                value: 'false'
            }, {
                field: 'user_id',
                operator: '=',
                value: `${updatedSession.userId}`
            }]
        })
        if (notRevokedSession.length > 0) {
            for (const session of notRevokedSession) {
                await this.userSessions.updateEntity(
                    session.id,
                    {
                        isRevoked: true,
                        lastUsedAt: new Date()
                    } as UpdateData<UserSessionsEntity>,
                    {})
            }
        }

    }
    
    /**
     * Validates a user session.
     * @param token The token to validate.
     * @param ipAddress The IP address of the user.
     * @returns The user and session entities if valid, throws an error otherwise.
     */
    public async validateUserSession(
        token: string, 
        ipAddress: string,
        status: UserStatus = 'active'
    ): Promise<UserSessionsEntity> {
        const options = {
            where: { 
                ip_address: ipAddress,
                is_revoked: false,
                status: status
            },
            filters: [{
                field: 'expires_at',
                operator: '>',
                value: new Date()
            }]
        } as QueryFields<UserSessionsEntity>
        // Encontra a sessão pelo ip e status
        const activeSessions = await this.userSessions.findByEntity(options)
        if (activeSessions.length !== 0) {
            // Valida o token de cada sessão
            for (const session of activeSessions) {           
                if (
                    this.validateToken(
                    token,
                    session.tokenHash
                    )
                ) {
                    session.lastUsedAt = new Date()
                    return await this.userSessions.updateEntity(session.id, session, {})
                }
            }
        }
        throw new apiError(MESSAGES.DATABASE.LOGIN.INVALID_SESSION, 'INVALID_SESSIONS', 401)
    }
}