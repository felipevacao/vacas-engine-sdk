import { BaseController } from '@controllers/baseController';
import UsersModel from '@dynamic-modules/models/users';
import { UsersEntity } from '@dynamic-modules/entities/users';
import { QueryFilter, UserRolesType, UserStatusType } from '@app-types/entity';
export class UsersController extends BaseController<UsersEntity> {
	constructor() {
		super(UsersModel);
	}

	public getDefaultFilters(): QueryFilter[] {
		return [
			{ field: 'status', operator: '=', value: UserStatusType.ACTIVE },
			{ field: 'role', operator: '!=', value: UserRolesType.GUEST }
		]
	}
}
