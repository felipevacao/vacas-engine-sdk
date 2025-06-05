import { User_sessionsController } from "@core/controllers/User_sessionsController";
import { cryptoUtils } from "@utils/crypto";
import { UsersEntity } from "@core/entities/users";
import { CreateData, QueryFields } from "types/entity";
import { User_sessionsEntity } from "@core/entities/user_sessions";

export class SessionController {
    private user_sessions: User_sessionsController;

    constructor() {
        this.user_sessions = new User_sessionsController();
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
            user_id: user.id,
            token_hash: hash,
            expires_at: cryptoUtils.getExpiresAt(),
            ip_address: '127.0.0.1',
        } as CreateData<User_sessionsEntity>, {});

        return { token, hash };
    }

}