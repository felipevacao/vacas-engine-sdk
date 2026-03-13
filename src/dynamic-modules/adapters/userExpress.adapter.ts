import { Request, Response } from 'express';
import { ExpressAdapter } from "@adapters/express.adapter"
import { AuthController } from "@controllers/AuthController"
import { UsersEntity } from "@dynamic-modules/entities/users"
import { LoginRequest } from "types/entity"
import { MESSAGES } from '@constants/messages/index';
import { ResponseHandler } from '@utils/responseHandler';
import { apiError } from '@utils/error';


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
            throw new apiError(MESSAGES.ERROR.INVALID_FORMAT)
        }
        const { email, password } = input as LoginRequest
        if (!email || !password) {
            throw new apiError(MESSAGES.ERROR.INVALID_FORMAT)
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
                MESSAGES.ERROR.OPERATION_ERROR,
                400,
                error as Error
            )
        }

    }

    
}