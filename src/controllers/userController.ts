import { BaseController } from './baseController';
import UserModel from '../models/user';
import { UserEntity } from '../types/entity';

export class UserController extends BaseController<UserEntity> {
    constructor() {
        super(UserModel);
    }
}