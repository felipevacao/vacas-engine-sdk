// Gerado automáticamente
import { MESSAGES } from '@constants/messages';
import { UserSessionsEntity } from '@core-modules/userSessions/entity';
import * as repository from '@services/repository';
import { apiError } from '@utils/error';
import { Model, Relation } from '@app-types/entity';

const relations: Record<string, Relation> = {};

const UserSessionsModel: Model<UserSessionsEntity> = {
  table: 'user_sessions',
  create: repository.create<UserSessionsEntity>('user_sessions'),
  findAll: repository.read<UserSessionsEntity>('user_sessions').findAll,
  findAllPaginated: repository.read<UserSessionsEntity>('user_sessions').findAllPaginated,
  findById: repository.read<UserSessionsEntity>('user_sessions').findById,
  findBy: repository.read<UserSessionsEntity>('user_sessions').findBy,
  findByPaginated: repository.read<UserSessionsEntity>('user_sessions').findByPaginated,
  update: repository.update<UserSessionsEntity>('user_sessions'),
  delete: repository.deleteById('user_sessions'),
  forceDelete: repository.forceDelete('user_sessions'),
  count: repository.read<UserSessionsEntity>('user_sessions').count,
  selectAbleFields: ['userId', 'expiresAt', 'lastUsedAt', 'isRevoked', 'tokenHash', 'ipAddress'],
  defaultFields: ['id'],
  excludedFields: [],
  relations,
  metadata: async () => {
    const result = await repository.metadata('user_sessions')();
    if (!result) throw new apiError(MESSAGES.DATABASE.ENTITY.METADATA_NOT_FOUND);
    return result;
  },
};

export default UserSessionsModel;
