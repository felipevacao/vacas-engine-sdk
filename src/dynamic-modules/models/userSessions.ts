// Gerado automáticamente
import { UserSessionsEntity } from '@dynamic-modules/entities/userSessions';
import * as baseService from '@services/baseServices';
import { Model } from 'types/entity';

const UserSessionsModel: Model<UserSessionsEntity> = {
  table: 'user_sessions',
  create: baseService.create<UserSessionsEntity>('user_sessions'),
  findAll: baseService.read<UserSessionsEntity>('user_sessions').findAll,
  findById: baseService.read<UserSessionsEntity>('user_sessions').findById,
  findBy: baseService.read<UserSessionsEntity>('user_sessions').findBy,
  update: baseService.update<UserSessionsEntity>('user_sessions'),
  delete: baseService.deleteById('user_sessions'),
  forceDelete: baseService.forceDelete('user_sessions'),
  selectAbleFields: ['userId', 'expiresAt', 'lastUsedAt', 'isRevoked', 'tokenHash', 'ipAddress'],
  defaultFields: ['id'],
  excludedFields: [],
};

export default UserSessionsModel;
