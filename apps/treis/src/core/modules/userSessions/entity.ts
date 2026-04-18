// Gerado automáticamente
import { BaseEntity } from '@interfaces';

export interface UserSessionsEntity extends BaseEntity {
  id: string;
  userId: number;
  expiresAt: Date;
  lastUsedAt: Date;
  isRevoked: boolean;
  tokenHash: string;
  ipAddress: string;
  status: 'active' | 'reset_required';
}