import { UserSessionsController } from "@dynamic-modules/controllers/userSessions";
import { cryptoUtils } from "@utils/crypto";
import { CreateData, QueryFields, UpdateData } from "types/entity";
import { UserSessionsEntity } from "@dynamic-modules/entities/userSessions";
import { UsersController } from "@dynamic-modules/controllers/users";
import { UsersEntity } from "@dynamic-modules/entities/users";

export class SessionController {
    private userSessions: UserSessionsController;
    private user: UsersController;

    constructor() {
        this.userSessions = new UserSessionsController();
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

    private async verifySession(user: UsersEntity, ipAddress: string): Promise<boolean> {
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
        } as QueryFields<UserSessionsEntity>;

        const userSessions = await this.userSessions.findByEntity(options);

        return userSessions && userSessions.length > 0;
    }

    public async createSession(user: UsersEntity, ipAddress: string): Promise<{ token: string }> {

        if(await this.verifySession(user, ipAddress)) {
            throw new Error('Usuário já autenticado!');
        }

        const { token, hash } = this.createToken();
        await this.userSessions.createEntity({
            userId: user.id as number,
            tokenHash: hash,
            expiresAt: cryptoUtils.getExpiresAt(),
            ipAddress: ipAddress,
        } as CreateData<UserSessionsEntity>, {});

        return { token: token };
    }

    public async deleteSession(sessionId: string | number): Promise<void> {
        await this.userSessions.updateEntity(sessionId, { isRevoked: true } as UpdateData<UserSessionsEntity>, {});
    }
    
    public async validateUser(token: string, ipAddress: string): Promise<[UsersEntity, UserSessionsEntity]> {
        
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

        const activeSessions = await this.userSessions.findByEntity(options);   
        if(activeSessions.length === 0) {
            throw new Error('Sessão inválida!');
        }

        for (const session of activeSessions) {
            const isValid = this.validateToken(token, session.tokenHash);
            
            if (isValid) {
                const user = await this.user.findByIdEntity(session.userId, {
                    fields: this.user.getAvailableFields(),
                });
                return [user as UsersEntity, session];
            }
        }
        throw new Error('Sessão inválida!');
    }
}