export interface BaseEntity {
    id?: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | null;
    links: { rel: string; href: string; method: string; }[];
}

export type CreateData<T extends BaseEntity> = Omit<T, 'id' | 'createdAt' | 'updatedAt' |  'deletedAt'>;

export type UpdateData<T extends BaseEntity> = Omit<T, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;

export type ReadData<T extends BaseEntity> = Omit<T, 'createdAt' | 'updatedAt' | 'deletedAt'>;

export * from "./entities/model";
export * from './queryTypes';