import { UserExpressAdapter } from "./userExpress.adapter"
import { AuthController } from "@controllers/AuthController"
import { Request, Response } from 'express';
import { MESSAGES } from '@constants/messages/index';
import { ResponseHandler } from '@utils/responseHandler';
import { PasswordChangeRequest, PasswordResetRequest, UpdateData } from "types/entity"
import { apiError } from "@utils/error";
import { getClientIP } from "@utils/ip";
import { UsersEntity } from "@dynamic-modules/entities/users";

export class PasswordExpressAdapter extends UserExpressAdapter {
	constructor(
		protected service: AuthController) {
		super(service)
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
                    MESSAGES.ERROR.USER_NOT_FOUND,
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
            ResponseHandler.success(res, { message: 'Senha alterada com sucesso! Logout efetuado! Favor realizar Login novamente!' });
            await this.service.logout(req.session.sessionId as string)

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
		if (!email ) {
			throw new apiError(email)
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
				'NOT_FOUND',
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
				'NOT_FOUND',
				404
			)
			return
		}
		await this.service.updateEntity(
			user.id as number,
			{ status: 'active' } as UpdateData<UsersEntity>,
			{}
		).then( async () => {
			await this.service.updatePassword(user, newPassword)
		}).finally( async () => {
			await this.service.logout(req.session.sessionId as string)
		})
		ResponseHandler.success(res, { message: 'Senha alterada com sucesso! Favor realizar Login novamente!' });

	}
	
}
