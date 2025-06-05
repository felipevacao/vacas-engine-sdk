// Gerado automáticamente
import { BaseEntity } from 'types/entity';

export interface User_sessionsEntity extends BaseEntity {
    user_id: number;
    expires_at: Date;
    last_used_at: Date;
    is_revoked: boolean;
    token_hash: string;
    ip_address: string;
  }