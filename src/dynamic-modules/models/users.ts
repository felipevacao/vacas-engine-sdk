import { MESSAGES } from '@constants/messages';
import { UsersEntity } from '@dynamic-modules/entities/users';
import * as repository from '@services/repository';
import { apiError } from '@utils/error';
import { Model } from 'types/entity';

const UsersModel: Model<UsersEntity> = {
  table: 'users',
  create: repository.create<UsersEntity>('users'),
  findAll: repository.read<UsersEntity>('users').findAll,
  findAllPaginated: repository.read<UsersEntity>('users').findAllPaginated,
  findById: repository.read<UsersEntity>('users').findById,
  findBy: repository.read<UsersEntity>('users').findBy,
  findByPaginated: repository.read<UsersEntity>('users').findByPaginated,
  update: repository.update<UsersEntity>('users'),
  delete: repository.deleteById('users'),
  forceDelete: repository.forceDelete('users'),
  selectAbleFields: ['name', 'login', 'email'],
  defaultFields: ['id'],
  excludedFields: ['password', 'pepper'],
  metadata: async () => {
    const result = await repository.metadata('users')();
    if (!result) throw new apiError(MESSAGES.DATABASE.ENTITY.METADATA_NOT_FOUND);
    return result;
  },
};

export default UsersModel;
