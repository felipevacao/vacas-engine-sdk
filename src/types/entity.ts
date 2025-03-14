export interface BaseEntity {
    id?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export * from "./entities/user";
export * from "./entities/model";

export * from './queryTypes';