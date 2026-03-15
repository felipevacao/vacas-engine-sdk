import { BaseController } from '@controllers/baseController';
import UsersModel from '@dynamic-modules/models/users';
import { UsersEntity } from '@dynamic-modules/entities/users';
export class UsersController extends BaseController<UsersEntity> {
	constructor() {
		super(UsersModel);
	}
}
