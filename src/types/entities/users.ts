import { BaseEntity } from '../entity';

export interface UsersEntity extends BaseEntity {
    name: string;
    email: string;
    login: string;
    password: string;
  }