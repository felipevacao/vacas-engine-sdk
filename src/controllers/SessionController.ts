import { User_sessionsController } from "@dynamic-modules/controllers/User_sessionsController";
import { cryptoUtils } from "@utils/crypto";
import { CreateData, OutputData, QueryFields } from "types/entity";
import { User_sessionsEntity } from "@dynamic-modules/entities/user_sessions";
import { UsersController } from "@dynamic-modules/controllers/UsersController";
import { UsersEntity } from "@dynamic-modules/entities/users";

export class SessionController {
    private user_sessions: User_sessionsController;
    private user: UsersController;

    constructor() {
        this.user_sessions = new User_sessionsController();
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
        } as QueryFields<User_sessionsEntity>;

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
        } as CreateData<User_sessionsEntity>, {});

        return { token, hash };
    }

    public async validateUser(token: string, ipAddress: string): Promise<[OutputData<UsersEntity>, User_sessionsEntity] | [ boolean, boolean]> {
        
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
        } as QueryFields<User_sessionsEntity>;

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