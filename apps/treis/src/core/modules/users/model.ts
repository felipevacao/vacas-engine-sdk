import { MESSAGES } from '@constants';
import { UsersEntity } from './entity';
import * as repository from '@services';
import { apiError } from '@utils';
import { Model } from "@interfaces";

const UsersModel: Model<UsersEntity> = {
  table: 'vacas_users',
  create: repository.create<UsersEntity>('vacas_users'),
  findAll: repository.read<UsersEntity>('vacas_users').findAll,
  findAllPaginated: repository.read<UsersEntity>('vacas_users').findAllPaginated,
  findById: repository.read<UsersEntity>('vacas_users').findById,
  findBy: repository.read<UsersEntity>('vacas_users').findBy,
  findByPaginated: repository.read<UsersEntity>('vacas_users').findByPaginated,
  update: repository.update<UsersEntity>('vacas_users'),
  createBulk: repository.createBulk<UsersEntity>('vacas_users'),
  updateBulk: repository.updateBulk<UsersEntity>('vacas_users'),
  deleteBulk: repository.deleteBulk<UsersEntity>('vacas_users'),
  delete: repository.deleteById('vacas_users'),
  restore: () => Promise.resolve<boolean>(false), // Não implementado
  forceDelete: () => Promise.resolve<boolean>(false), // Não implementado
  count: repository.read<UsersEntity>('vacas_users').count,
  selectAbleFields: ['name', 'login', 'email', 'role'],
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
