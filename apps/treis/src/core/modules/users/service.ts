import { UsersController } from "./controller";
import { CreateData, InputRequest, QueryFields, UpdateData, QueryFilter, UserStatus, OutputData } from '@app-types/entity';
import { hashUtils } from '@utils/hash';
import { BaseServices } from "@services/baseServices";
import { UsersEntity } from "./entity";
import { apiError } from "@utils/error";
import { MESSAGES } from "@constants/messages";
import { HttpStatus } from "@constants/HttpStatus";
import { ServiceFactory } from "@services/serviceFactory";

export class UserService extends BaseServices<UsersEntity, UsersController> {

	constructor(
		id: number = 0,
		protected entityController: UsersController = new UsersController
	) {
		super(entityController)
        this.id = id
		if (this.id !== 0) {
			this.validateId(this.id)
		}
	}

	override async generateBodyCreate(
		input: InputRequest<unknown>
	): Promise<CreateData<UsersEntity> | null> {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { role, status, ...body } = input.body as CreateData<UsersEntity>;

		const options = {
			where: {
				"email": body.email
			},
			fields: this.getAvailableFields()
		} as QueryFields<UsersEntity>

		const verifyMail = await this.entityController.findByEntity(options)
		if (verifyMail && verifyMail.length > 0) {
			throw new apiError(MESSAGES.ERROR.INVALID_EMAIL, 401)
		}

		options.where = { "login": body.login }

		const verifyLogin = await this.entityController.findByEntity(options)
		if (verifyLogin && verifyLogin.length > 0) {
			throw new apiError(MESSAGES.ERROR.INVALID_LOGIN_TEXT)
		}

		if (body.password) {
			const { passwordHash, pepper } = await hashUtils.generateHash(body.password)
			body.password = passwordHash
			body.pepper = pepper
		}

		return body as CreateData<UsersEntity>;
	}

	override getEntity(): OutputData<UsersEntity> {
		if (!this._entity) {
			throw new apiError(
				MESSAGES.ERROR.INVALID_LOGIN,
				HttpStatus.UNAUTHORIZED,
				this.getContext()
			)
		}
		return this._entity
	}

	override async generateBodyUpdate(
		input: InputRequest<unknown>
	): Promise<UpdateData<UsersEntity> | null> {
		const body = input.body as Partial<UpdateData<UsersEntity>>;
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password, role, status, pepper, ...rest } = body;
		return rest as UpdateData<UsersEntity>;
	}

	getFilterUserStatus(status: UserStatus): QueryFilter {
		return {
			field: "status",
			operator: "=",
			value: status,
		}
	}

	getExpiresAtMinutes(): number {
		switch (this.getEntity().role) {
			case 'admin': return 120
			case 'guest': return 5
			default: return 60
		}
	}

	async getUserByEmail(
		email: string
	): Promise<this> {

		this.contextDetail(`email: ${email}`)
		const options = {
			where: { "email": email },
			filters: [{
				field: "status",
				operator: "=",
				value: "active",
			}]
		} as QueryFields<UsersEntity>

		const userData = await this.entityController.findByEntity(options);
		if (!userData) {
			this.contextDetail(`not_found: ${email}`)
		}
		if (Array.isArray(userData)) {
			this._entity = userData[0]
		}

		return this
	}

	async updateStatus(
		status: UserStatus
	) {
		try {
			const entity = this.getEntity()
			this.contextDetail(`userId: ${entity?.id}`)
			if (entity.id) {
				entity.status = status
				await this.entityController.updateEntity(entity.id, entity)
			}
		} catch {
			throw new apiError(MESSAGES.DATABASE.ENTITY.UPDATE_ERROR)
		}
	}

}

// Registro automático para Eager Loading
ServiceFactory.register('users', () => new UserService());