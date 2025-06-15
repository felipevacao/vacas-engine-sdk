import { UserSessionsController } from "@dynamic-modules/controllers/userSessions"
import { cryptoUtils } from "@utils/crypto"
import { CreateData, QueryFields, UpdateData } from "types/entity"
import { UserSessionsEntity } from "@dynamic-modules/entities/userSessions"
import { UsersController } from "@dynamic-modules/controllers/users"
import { UsersEntity } from "@dynamic-modules/entities/users"

export class SessionController {
    private userSessions: UserSessionsController
    private user: UsersController

    /**
     * Creates an instance of SessionController.
     * Initializes the userSessions and user controllers.
     */
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
    ): Promise<boolean> {

        const options = {
            where: { 
                user_id: user.id,
                ip_address: ipAddress,
                is_revoked: false
             },
             whereSign: {
                field: 'expires_at',
                sign: '>',
                value: new Date().toLocaleString()
             }
        } as QueryFields<UserSessionsEntity>

        const userSessions = await this.userSessions.findByEntity(options)

        return userSessions && userSessions.length > 0

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
    ): Promise<{ token: string }> {
        // Check if the user already has an active session
        if(await this.verifySession(user, ipAddress)) {
            throw new Error('Usuário já autenticado!')
        }
        // Generate a new token and its hash
        const { token, hash } = this.createToken()

        // Create a new session entity
        await this.userSessions.createEntity({
            userId: user.id as number,
            tokenHash: hash,
            expiresAt: cryptoUtils.getExpiresAt(),
            ipAddress: ipAddress,
        } as CreateData<UserSessionsEntity>, {})

        return { token: token }

    }

    /**
     * Deletes a session by its ID.
     * @param sessionId The ID of the session to delete.
     */
    public async deleteSession(
        sessionId: string | number
    ): Promise<void> {
        // Marks the  session as revoked
        await this.userSessions.updateEntity(sessionId, { isRevoked: true } as UpdateData<UserSessionsEntity>, {})

    }
    
    /**
     * Validates a user session.
     * @param token The token to validate.
     * @param ipAddress The IP address of the user.
     * @returns The user and session entities if valid, throws an error otherwise.
     */
    public async validateUser(
        token: string, 
        ipAddress: string
    ): Promise<[UsersEntity, UserSessionsEntity]> {
        
        const options = {
            where: { 
                ip_address: ipAddress,
                is_revoked: false
             },
             whereSign: {
                field: 'expires_at',
                sign: '>',
                value: new Date().toLocaleString()
             }
        } as QueryFields<UserSessionsEntity>
        // Find active sessions for the given IP address
        const activeSessions = await this.userSessions.findByEntity(options)
        if(activeSessions.length === 0) {
            throw new Error('Sessão inválida!')
        }

        // Validate the token for each active session
        for (const session of activeSessions) {
            const isValid = this.validateToken(
                                token, 
                                session.tokenHash
                            )
            
            if (isValid) {
                const user = await this.user.findByIdEntity(session.userId, {
                    fields: this.user.getAvailableFields(),
                })
                return [user as UsersEntity, session]
            }
        }
        throw new Error('Sessão inválida!')
    }
}