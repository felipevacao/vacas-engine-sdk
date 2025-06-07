import { Request, Response } from 'express';
import { ExpressAdapter } from "@adapters/express.adapter"
import { AuthController } from "@controllers/AuthController"
import { UsersEntity } from "@dynamic-modules/entities/users"
import { LoginRequest } from "types/entity"
import { ERROR_CODES } from '@constants/errorCodes';
import { ResponseHandler } from '@utils/responseHandler';


export class UserExpressAdapter extends ExpressAdapter<UsersEntity> {
    constructor(
        protected service: AuthController) {
        super(service)
    }

    /**
     * Validates the input for login fields.
     * @param input - Object containing email and password
     * @returns Array containing email and password
     * @throws Error if the input is invalid or if the fields are missing
     */
    private validateLoginFields(
        input: unknown
        ): [string, string] {

            if(!input || typeof input !== 'object') {
                throw new Error('Invalid input')
            }
            const { email, password } = input as LoginRequest
            if(!email || !password) {
                throw new Error('Invalid input')
            }
            
            return [ email, password ]
    }
    
    /**
     * Handles user login.
     * @param req - Express request object containing the login credentials
     * @param res - Express response object to send the result
     */
    async login(
        req: Request, 
        res: Response
        ): Promise<void> {

            try {
                // validates input
                const [login, password] = this.validateLoginFields(req.body)

                // validates login
                const session = await this.service.login(login, password, '127.0.0.1')
                if(!session){
                    ResponseHandler.error(
                        res,
                        'Invalid login or password',
                        ERROR_CODES.UNAUTHORIZED,
                        401
                    )
                    return
                }

                // resposta
                ResponseHandler.success(res, session, 'Login realizado com sucesso');
            } catch (error) {
                ResponseHandler.error(
                    res,
                    'Erro ao verificar Login',
                    ERROR_CODES.INTERNAL_ERROR,
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
            await this.service.logout(req.session.id)

            ResponseHandler.success(res, { message: 'Logout realizado com sucesso' });
        } catch (error) {
            ResponseHandler.error(
                res,
                'Erro ao realizar o Logout',
                ERROR_CODES.INTERNAL_ERROR,
                400,
                error as Error
            )
        }

    }
}