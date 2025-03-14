
import { BaseController } from '../controllers/baseController';
import UsersModel from '../models/users';
import { UsersEntity } from '../types/entities/users';

export class UsersController extends BaseController<UsersEntity> {
  constructor() {
      super(UsersModel);
  }
}
