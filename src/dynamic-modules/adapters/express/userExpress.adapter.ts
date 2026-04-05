import { Request, Response } from 'express';
import { ExpressAdapter } from "@adapters/express.adapter"
import { UsersEntity } from "@dynamic-modules/entities/users"
import { PasswordChangeRequest, PasswordResetRequest } from "types/entity"
import { MESSAGES } from '@constants/messages/index';
import { ResponseHandler } from '@utils/responseHandler';
import { apiError } from '@utils/error';
import { AuthUserSessionWorkflow } from 'workflows/AuthUserSession';
import { UserService } from '@dynamic-modules/services/user';
import { getClientIP } from '@utils/ip';


export class UserExpressAdapter extends ExpressAdapter<UsersEntity> {
    constructor(
        protected service: UserService,
        protected auth: AuthUserSessionWorkflow
    ) {
        super(service)
    }



    /**
    *  Requisição para Login de usuário.
     */
    async login(
        req: Request,
        res: Response
    ): Promise<void> {
        // valida o input
        const [login, password] = this.auth.validateLoginFields(req.body)
        // efetua login e gera sessão
        const session = await this.auth.login(login, password, getClientIP(req))

        // resposta
        ResponseHandler.success(res, session, MESSAGES.DATABASE.LOGIN.SUCCESS);
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
        await this.auth.logout(req.session.sessionId as string)
        ResponseHandler.success(res, { message: 'Logout realizado com sucesso' });
    }


    /** * Validates the input for updating the password fields.
     * @param input - Object containing currentPassword and newPassword
     * @returns Array containing currentPassword and newPassword
     * @throws Error if the input is invalid or if the fields are missing
     */
    protected validateUpdatePasswordFields(
        input: unknown
    ): [string, string] {

        if (!input || typeof input !== 'object') {
            throw new apiError(MESSAGES.ERROR.INVALID_FORMAT)
        }
        const { currentPassword, newPassword } = input as PasswordChangeRequest
        if (!currentPassword || !newPassword) {
            throw new apiError(MESSAGES.ERROR.INVALID_FORMAT)
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

        // validates input
        const [currentPassword, newPassword] = this.validateUpdatePasswordFields(req.body)

        await this.auth.updateUserPassword(
            req.session.userId as number,
            currentPassword,
            newPassword
        )

        await this.auth.logout(req.session.sessionId as string)

        ResponseHandler.success(res, { message: MESSAGES.API.PASSWORD_CHANGED.message });

    }

    /**
    * Valida os campos de login.
        */
    private validateResetPasswordFields(
        input: unknown
    ): { email: string, newPassword?: string } {

        if (!input || typeof input !== 'object') {
            throw new apiError(MESSAGES.ERROR.INVALID_FORMAT)
        }
        const { email, newPassword } = input as PasswordResetRequest
        if (!email) {
            throw new apiError(MESSAGES.ERROR.INVALID_FORMAT)
        }

        return { email, newPassword }
    }

    async forgotPassword(
        req: Request,
        res: Response
    ): Promise<void> {
        const { email } = this.validateResetPasswordFields(req.body)
        const session = await this.auth.resetPasswordSession(email, getClientIP(req))
        ResponseHandler.success(res, session, MESSAGES.API.SUCCESS_DATA);
    }

    async resetPassword(
        req: Request,
        res: Response
    ): Promise<void> {
        const { email, newPassword } = this.validateResetPasswordFields(req.body)
        if (!newPassword) {
            throw new apiError(MESSAGES.ERROR.INVALID_FORMAT)
        }
        await this.auth.resetPassword(
            req.session.sessionId as string,
            req.session.userId as number,
            email,
            newPassword
        )
        ResponseHandler.success(res, { message: MESSAGES.API.PASSWORD_CHANGED.message });
    }

    async updateUser(
        req: Request,
        res: Response
    ): Promise<void> {
        // Valida Input
        const id = parseInt(req.params.id as string)
        const data = await this.auth.validateUpdate(id, req, req.session.userId as number)
        const options = this.generateQueryFields(req)
        // Atualiza entidade
        const result = await this.service.updateEntity(id, data, options)
        // resposta
        ResponseHandler.success(res, result)
    }

    async getMe(
        req: Request,
        res: Response
    ): Promise<void> {
        const user = await this.service.findByIdEntity(req.session.userId as number, this.generateQueryFields(req))
        ResponseHandler.success(res, user)
    }

    async refreshSession(
        req: Request,
        res: Response
    ): Promise<void> {
        const session = await this.auth.resetSession(req.session.sessionId as string)
        ResponseHandler.success(res, session, MESSAGES.DATABASE.LOGIN.ACTIVE_SESSION);
    }
}