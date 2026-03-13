// Gerado automáticamente
import { UserSessionsEntity } from '@dynamic-modules/entities/userSessions';
import * as repository from '@services/repository';
import { Model } from 'types/entity';

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
  selectAbleFields: ['userId', 'expiresAt', 'lastUsedAt', 'isRevoked', 'tokenHash', 'ipAddress'],
  defaultFields: ['id'],
  excludedFields: [],
  metadata: async () => {
      const result = await repository.metadata('user_sessions')();
      if (!result) throw new Error('Metadata not found');
      return result;
    },
};

export default UserSessionsModel;
