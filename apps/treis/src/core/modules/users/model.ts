import { MESSAGES } from '@constants/messages';
import { UsersEntity } from './entity';
import * as repository from '@services/repository';
import { apiError } from '@utils/error';
import { Model } from '@app-types/entity';

const UsersModel: Model<UsersEntity> = {
  table: 'vacas_users',
  create: repository.create<UsersEntity>('vacas_users'),
  findAll: repository.read<UsersEntity>('vacas_users').findAll,
  findAllPaginated: repository.read<UsersEntity>('vacas_users').findAllPaginated,
  findById: repository.read<UsersEntity>('vacas_users').findById,
  findBy: repository.read<UsersEntity>('vacas_users').findBy,
  findByPaginated: repository.read<UsersEntity>('vacas_users').findByPaginated,
  update: repository.update<UsersEntity>('vacas_users'),
  delete: repository.deleteById('vacas_users'),
  forceDelete: repository.forceDelete('vacas_users'),
  count: repository.read<UsersEntity>('vacas_users').count,
  selectAbleFields: ['name', 'login', 'email'],
  defaultFields: ['id'],
  excludedFields: ['password', 'pepper'],
  relations: {},
  metadata: async () => {
    const result = await repository.metadata('vacas_users')();
    if (!result) throw new apiError(MESSAGES.DATABASE.ENTITY.METADATA_NOT_FOUND);
    return result;
  },
};

export default UsersModel;
