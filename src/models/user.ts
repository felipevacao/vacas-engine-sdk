import * as baseService from '../services/baseServices';
import { Model, UserEntity } from '../types/entity';

const UserModel: Model<UserEntity> = {
    create: baseService.create<UserEntity>('users'),
    findAll: baseService.read<UserEntity>('users').findAll,
    findById: baseService.read<UserEntity>('users').findById,
    findBy: baseService.read<UserEntity>('users').findBy,
};

export default UserModel;