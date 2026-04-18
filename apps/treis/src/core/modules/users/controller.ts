import { BaseController } from '@controllers';
import UsersModel from './model';
import { UsersEntity } from './entity';
import { QueryFilter, UserRolesType, UserStatusType } from '@app-types';
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
