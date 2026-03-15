import { UsersController } from "@dynamic-modules/controllers/users";
import { CreateData, InputRequest, QueryFields, UpdateData, QueryFilter, UserStatus } from 'types/entity';
import { hashUtils } from '@utils/hash';
import { BaseServices } from "@services/baseServices";
import { UsersEntity } from "@dynamic-modules/entities/users";

export class UsersService extends BaseServices<UsersEntity, UsersController> {

	constructor(
		protected entityController: UsersController
	) {
		super(entityController)
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
			throw new Error('E-mail already exists')
		}

		options.where = { "login": body.login }

		const verifyLogin = await this.entityController.findByEntity(options)
		if (verifyLogin && verifyLogin.length > 0) {
			throw new Error('Login already exists')
		}

		if (body.password) {
			const { passwordHash, pepper } = await hashUtils.generateHash(body.password)
			body.password = passwordHash
			body.pepper = pepper
		}

		return body as CreateData<UsersEntity>;
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

}