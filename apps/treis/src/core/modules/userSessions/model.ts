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
  createBulk: () => Promise.resolve([]), // Não implementado,
  updateBulk: () => Promise.resolve([]), // Não implementado,,
  deleteBulk: () => Promise.resolve<boolean>(false), // Não implementado,,
  delete: () => Promise.resolve<boolean>(false), // Não implementado
  forceDelete: () => Promise.resolve<boolean>(false), // Não implementado,
  restore: () => Promise.resolve<boolean>(false), // Não implementado
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
