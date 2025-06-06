// Gerado automáticamente
import { User_sessionsEntity } from '@dynamic-modules/entities/user_sessions';
import * as baseService from '@services/baseServices';
import { Model } from 'types/entity';

const User_sessionsModel: Model<User_sessionsEntity> = {
  table: 'user_sessions',
  create: baseService.create<User_sessionsEntity>('user_sessions'),
  findAll: baseService.read<User_sessionsEntity>('user_sessions').findAll,
  findById: baseService.read<User_sessionsEntity>('user_sessions').findById,
  findBy: baseService.read<User_sessionsEntity>('user_sessions').findBy,
  update: baseService.update<User_sessionsEntity>('user_sessions'),
  delete: baseService.deleteById('user_sessions'),
  forceDelete: baseService.forceDelete('user_sessions'),
  selectAbleFields: ['userId', 'expiresAt', 'lastUsedAt', 'isRevoked', 'tokenHash', 'ipAddress'],
  defaultFields: ['id'],
  excludedFields: [],
};

export default User_sessionsModel;
