import { Request, Response } from 'express';
import { ExpressAdapter } from "@adapters/express.adapter"
import { UsersEntity } from "@dynamic-modules/entities/users"
import { LoginRequest, PasswordChangeRequest } from "types/entity"
import { MESSAGES } from '@constants/messages/index';
import { ResponseHandler } from '@utils/responseHandler';
import { apiError } from '@utils/error';
import { AuthUserSessionWorkflow } from 'workflows/AuthUserSession';
import { UserService } from '@dynamic-modules/services/user';
import { getClientIP } from '@utils/ip';


export class UserExpressAdapter extends ExpressAdapter<UsersEntity> {
    constructor(
        protected service: UserService,
        protected auth: AuthUserSessionWorkflow = new AuthUserSessionWorkflow(service)
    ) {
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
            // efetua login e gera sessão
            const session = this.auth.login(login, password, getClientIP(req))
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
            await this.auth.logout(req.session.sessionId as string)

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

        try {
            // validates input
            const [currentPassword, newPassword] = this.validateUpdatePasswordFields(req.body)
            // const user = await this.service.findByIdEntity(req.session.userId as number)
            // if (!user) {
            //     ResponseHandler.error(
            //         res,
            //         MESSAGES.ERROR.USER_NOT_FOUND,
            //         404
            //     )
            //     return
            // }

            // const [isPasswordValid] = await this.service.validatePassword(user, currentPassword)
            // if (!isPasswordValid) {
            //     ResponseHandler.error(
            //         res,
            //         MESSAGES.ERROR.INVALID_CREDENTIALS,
            //         401
            //     )
            //     return
            // }
            // await this.service.updatePassword(user, newPassword)
            // ResponseHandler.success(res, { message: 'Senha alterada com sucesso! Logout efetuado! Favor realizar Login novamente!' });
            // await this.service.logout(req.session.sessionId as string)

            await this.auth.updateUserPassword(
                req.session.id as string,
                req.session.userId as number,
                currentPassword,
                newPassword
            )

        } catch (error) {
            ResponseHandler.error(
                res,
                MESSAGES.ERROR.INTERNAL_ERROR,
                500,
                error as Error
            )
        }

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
        const session = await this.service.resetPasswordSession(email, getClientIP(req))
        if (!session) {
            ResponseHandler.error(
                res,
                MESSAGES.ERROR.USER_NOT_FOUND,
                404
            )
            return
        }

        ResponseHandler.success(res, session, MESSAGES.API.SUCCESS_DATA);

    }

    async resetPassword(
        req: Request,
        res: Response
    ): Promise<void> {

        const { email, newPassword } = this.validateResetPasswordFields(req.body)
        const user = await this.service.findByIdEntity(req.session.userId as number)
        if (!user ||
            !newPassword ||
            user.email !== email ||
            user.status !== 'reset_required'
        ) {
            ResponseHandler.error(
                res,
                MESSAGES.ERROR.USER_NOT_FOUND,
                404
            )
            return
        }
        await this.service.updateEntity(
            user.id as number,
            { status: 'active' } as UpdateData<UsersEntity>,
            {}
        ).then(async () => {
            await this.service.updatePassword(user, newPassword)
        }).finally(async () => {
            await this.service.logout(req.session.sessionId as string)
        })
        ResponseHandler.success(res, { message: 'Senha alterada com sucesso! Favor realizar Login novamente!' });

    }


}