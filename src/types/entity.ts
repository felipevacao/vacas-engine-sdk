export interface BaseEntity {
    id?: number;
    createdAt?: Date;
    updatedAt?: Date;
    links: { rel: string; href: string; method: string; }[];
}

export * from "./entities/model";
export * from './queryTypes';