import { BaseEntity } from "../entity";

export interface UserEntity extends BaseEntity {
    name: string;
    email: string;
}