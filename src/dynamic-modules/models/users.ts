import { UsersEntity } from '@dynamic-modules/entities/users';
import * as baseService from '@services/baseServices';
import { Model } from 'types/entity';

const UsersModel: Model<UsersEntity> = {
  table: 'users',
  create: baseService.create<UsersEntity>('users'),
  findAll: baseService.read<UsersEntity>('users').findAll,
  findAllPaginated: baseService.read<UsersEntity>('users').findAllPaginated,
  findById: baseService.read<UsersEntity>('users').findById,
  findBy: baseService.read<UsersEntity>('users').findBy,
  findByPaginated: baseService.read<UsersEntity>('users').findByPaginated,
  update: baseService.update<UsersEntity>('users'),
  delete: baseService.deleteById('users'),
  forceDelete: baseService.forceDelete('users'),
  selectAbleFields: ['name', 'email', 'login', 'role', 'status'],
  defaultFields: ['id'],
  excludedFields: ['password', 'pepper'],
  metadata: async () => {
    const result = await baseService.metadata('users')();
    if (!result) throw new Error('Metadata not found');
    return result;
  },
};

export default UsersModel;
