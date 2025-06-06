// Gerado automáticamente
import { BaseEntity } from 'types/entity';

export interface UserSessionsEntity extends BaseEntity {

        userId: number;
    expiresAt: Date;
    lastUsedAt: Date;
    isRevoked: boolean;
    tokenHash: string;
    ipAddress: string;
  }