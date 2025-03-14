export interface BaseEntity {
    id?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export * from "./entities/model";

export * from './queryTypes';