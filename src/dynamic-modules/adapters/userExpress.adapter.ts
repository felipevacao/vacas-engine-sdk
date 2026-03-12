import { Request, Response } from 'express';
import { ExpressAdapter } from "@adapters/express.adapter"
import { AuthController } from "@controllers/AuthController"
import { UsersEntity } from "@dynamic-modules/entities/users"
import { LoginRequest, PasswordChangeRequest } from "types/entity"
import { MESSAGES } from '@constants/messages/index';
import { ResponseHandler } from '@utils/responseHandler';


export class UserExpressAdapter extends ExpressAdapter<UsersEntity> {
    constructor(
        protected service: AuthController) {
        super(service)
    }

    /**
    * Valida os campos de login.
     */
    private validateLoginFields(
        input: unknown
    ): [email: string, password: string] {

        if (!input || typeof input !== 'object') {
            throw new Error(MESSAGES.ERROR.INVALID_FORMAT)
        }
        const { email, password } = input as LoginRequest
        if (!email || !password) {
            throw new Error(MESSAGES.ERROR.INVALID_FORMAT)
        }

        return [email, password]
    }

    /**
    *  Requisição para Login de usuário.
     */
    async login(
        req: Request,
        res: Response
    ): Promise<void> {
        try {
            // valida o input
            const [login, password] = this.validateLoginFields(req.body)

            // valida o login
            const session = await this.service.login(login, password, req.ip || '127.0.0.1')
            if (!session) {
                ResponseHandler.error(
                    res,
                    MESSAGES.ERROR.INVALID_LOGIN,
                    MESSAGES.ERROR.UNAUTHORIZED,
                    401
                )
                return
            }

            if (session && typeof session === 'object' && 'token' in session) {
                res.setHeader('Authorization', `Bearer ${session.token}`);
            }
            // resposta
            ResponseHandler.success(res, session, MESSAGES.DATABASE.LOGIN.SUCCESS);
        } catch (error) {
            ResponseHandler.error(
                res,
                MESSAGES.ERROR.ERROR_LOGIN,
                MESSAGES.ERROR.INTERNAL_ERROR,
                500,
                error as Error
            )
        }

    }

    /**
     * Handles user logout.
     * @param req - Express request object containing the session information
     * @param res - Express response object to send the result
     */
    async logout(
        req: Request,
        res: Response
    ): Promise<void> {
        try {
            if (!req.session) {
                throw new Error('No active session')
            }
            await this.service.logout(req.session.sessionId as string)

            ResponseHandler.success(res, { message: 'Logout realizado com sucesso' });
        } catch (error) {
            ResponseHandler.error(
                res,
                'Erro ao realizar o Logout',
                MESSAGES.ERROR.INTERNAL_ERROR,
                400,
                error as Error
            )
        }

    }

    /** * Validates the input for updating the password fields.
     * @param input - Object containing currentPassword and newPassword
     * @returns Array containing currentPassword and newPassword
     * @throws Error if the input is invalid or if the fields are missing
     */
    private validateUpdatePasswordFields(
        input: unknown
    ): [string, string] {

        if (!input || typeof input !== 'object') {
            throw new Error('Invalid input')
        }
        const { currentPassword, newPassword } = input as PasswordChangeRequest
        if (!currentPassword || !newPassword) {
            throw new Error('Invalid input')
        }

        return [currentPassword, newPassword]
    }
    /** * Handles updating the user's password.
 * @param req - Express request object containing the current and new passwords
 * @param res - Express response object to send the result
 */
    async updatePassword(
        req: Request,
        res: Response
    ): Promise<void> {

        try {
            // validates input
            const [currentPassword, newPassword] = this.validateUpdatePasswordFields(req.body)
            const user = await this.service.findByIdEntity(req.session.userId as number)
            if (!user) {
                ResponseHandler.error(
                    res,
                    'Usuário não encontrado',
                    MESSAGES.ERROR.NOT_FOUND,
                    404
                )
                return
            }

            const [ isPasswordValid ] = await this.service.validatePassword(user, currentPassword)
            if (!isPasswordValid) {
                ResponseHandler.error(
                    res,
                    'Senha atual inválida',
                    MESSAGES.ERROR.UNAUTHORIZED,
                    401
                )
                return
            }

            await this.service.updatePassword(user, newPassword)
            await this.service.logout(req.session.sessionId as string)
            ResponseHandler.success(res, { message: 'Senha alterada com sucesso! Logout efetuado! Favor realizar Login novamente!' });

        } catch (error) {
            ResponseHandler.error(
                res,
                'Erro ao verificar Login',
                MESSAGES.ERROR.INTERNAL_ERROR,
                500,
                error as Error
            )
        }

    }
}