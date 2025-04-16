export interface BaseEntity {
    id?: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | null;
}

export type HateoasLink = {
    rel: string;
    href: string;
    method: string;
};

export type HateoasEntity<T extends BaseEntity> = T & {
    _links: HateoasLink[];
};
  

// Layout de Entrada
export type CreateData<T extends BaseEntity> = Omit<T, 'id' | 'createdAt' | 'updatedAt' |  'deletedAt'>;

// Layout de Update
export type UpdateData<T extends BaseEntity> = Omit<T, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;

// Layout de Saída
export type OutputData<T extends BaseEntity> = Omit<
  T, 
  "createdAt" | 'updatedAt' | 'deletedAt'
>;

export type QueryFields<T extends BaseEntity> = { 
    fields?: (keyof T)[],
    where?: Partial<T>,
    limit?: number,
    offset?: number
}

export * from "./entities/model";
// export * from './queryTypes';
