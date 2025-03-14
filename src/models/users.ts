
import { UsersEntity } from '../types/entities/users';
import * as baseService from '../services/baseServices';
import { Model } from '../types/entity';

const UsersModel: Model<UsersEntity> = {
  table: 'users',
  create: baseService.create<UsersEntity>('users'),
  findAll: baseService.read<UsersEntity>('users').findAll,
  findById: baseService.read<UsersEntity>('users').findById,
  findBy: baseService.read<UsersEntity>('users').findBy,
};

export default UsersModel;
