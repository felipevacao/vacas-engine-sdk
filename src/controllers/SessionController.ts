import { UserSessionsController } from "@dynamic-modules/controllers/userSessions";
import { cryptoUtils } from "@utils/crypto";
import { CreateData, OutputData, QueryFields } from "types/entity";
import { UserSessionsEntity } from "@dynamic-modules/entities/userSessions";
import { UsersController } from "@dynamic-modules/controllers/UsersController";
import { UsersEntity } from "@dynamic-modules/entities/users";

export class SessionController {
    private user_sessions: UserSessionsController;
    private user: UsersController;

    constructor() {
        this.user_sessions = new UserSessionsController();
        this.user = new UsersController();
    }

    private createToken(): { token: string, hash: string } {
        const token = cryptoUtils.generateToken();
        const hash = cryptoUtils.hashToken(token);

        return { token, hash };
    }

    private validateToken(token: string, hash: string): boolean {
        return cryptoUtils.verifyToken(token, hash);
    }

    private async verifySession(user: UsersEntity): Promise<boolean> {
        const options = {
            where: { 
                user_id: user.id,
                ip_address: '127.0.0.1',
                is_revoked: false
             },
             whereSign: {
                field: 'expires_at',
                sign: '>',
                value: new Date().toLocaleString()
             }
        } as QueryFields<UserSessionsEntity>;

        const user_sessions = await this.user_sessions.findByEntity(options);

        return user_sessions && user_sessions.length > 0;
    }

    public async createSession(user: UsersEntity): Promise<{ token: string, hash: string }> {

        if(await this.verifySession(user)) {
            throw new Error('Usuário já autenticado!');
        }

        const { token, hash } = this.createToken();
        await this.user_sessions.createEntity({
            userId: user.id,
            tokenHash: hash,
            expiresAt: cryptoUtils.getExpiresAt(),
            ipAddress: '127.0.0.1',
        } as CreateData<UserSessionsEntity>, {});

        return { token, hash };
    }

    public async validateUser(token: string, ipAddress: string): Promise<[OutputData<UsersEntity>, UserSessionsEntity] | [ boolean, boolean]> {
        
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
        } as QueryFields<UserSessionsEntity>;

        const activeSessions = await this.user_sessions.findByEntity(options);   
        if(activeSessions.length === 0) {
            return [ false, false ];
        }

        for (const session of activeSessions) {
            const isValid = this.validateToken(token, session.tokenHash);
            
            if (isValid) {
                const user = await this.user.findByIdEntity(session.userId, {
                    fields: this.user.getAvailableFields(),
                });
                return [user as OutputData<UsersEntity>, session];
            }
        }

        return [ false, false ]
    }
}