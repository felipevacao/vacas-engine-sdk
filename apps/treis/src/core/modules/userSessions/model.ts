// Gerado automáticamente
import { MESSAGES } from '@constants';
import { UserSessionsEntity } from './entity';
import * as repository from '@services';
import { apiError } from '@utils';
import { Model, Relation } from "@interfaces";

const relations: Record<string, Relation> = {};

const UserSessionsModel: Model<UserSessionsEntity> = {
  table: 'vacas_user_sessions',
  create: repository.create<UserSessionsEntity>('vacas_user_sessions'),
  findAll: repository.read<UserSessionsEntity>('vacas_user_sessions').findAll,
  findAllPaginated: repository.read<UserSessionsEntity>('vacas_user_sessions').findAllPaginated,
  findById: repository.read<UserSessionsEntity>('vacas_user_sessions').findById,
  findBy: repository.read<UserSessionsEntity>('vacas_user_sessions').findBy,
  findByPaginated: repository.read<UserSessionsEntity>('vacas_user_sessions').findByPaginated,
  update: repository.update<UserSessionsEntity>('vacas_user_sessions'),
  createBulk: repository.createBulk<UserSessionsEntity>('vacas_user_sessions'),
  updateBulk: repository.updateBulk<UserSessionsEntity>('vacas_user_sessions'),
  deleteBulk: repository.deleteBulk<UserSessionsEntity>('vacas_user_sessions'),
  delete: repository.deleteById('vacas_user_sessions'),
  forceDelete: repository.forceDelete('vacas_user_sessions'),
  count: repository.read<UserSessionsEntity>('vacas_user_sessions').count,
  selectAbleFields: ['userId', 'expiresAt', 'lastUsedAt', 'isRevoked', 'tokenHash', 'ipAddress'],
  defaultFields: ['id'],
  excludedFields: [],
  relations,
  metadata: async () => {
    const result = await repository.metadata('vacas_user_sessions')();
    if (!result) throw new apiError(MESSAGES.DATABASE.ENTITY.METADATA_NOT_FOUND);
    return result;
  },
};

export default UserSessionsModel;
