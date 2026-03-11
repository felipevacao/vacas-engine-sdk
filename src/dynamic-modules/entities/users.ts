// Gerado automáticamente
import { BaseEntity } from 'types/entity';

export interface UsersEntity extends BaseEntity {
    name: string;
    email: string;
    login: string;
    password: string;
    role: 'admin' | 'manager' | 'regular' | 'guest';
    status: 'active' | 'inactive' | 'banned';
    pepper: string;
}