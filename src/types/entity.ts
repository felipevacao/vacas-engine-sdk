export interface BaseEntity {
    id?: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date
    links: { rel: string; href: string; method: string; }[];
}

// Tipo para dados de criação (sem campos automáticos)
export type CreateData<T extends BaseEntity> = Omit<T, 'id' | 'createdAt' | 'updatedAt' |  'deletedAt'>;

// Tipo para dados de atualização (id é separado)
export type UpdateData<T extends BaseEntity> = Omit<T, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;

export * from "./entities/model";
export * from './queryTypes';