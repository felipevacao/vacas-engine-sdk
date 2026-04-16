import { BaseEntity, CreateData, UpdateData, OutputData, QueryFields, Metadata, PaginatedResult } from "@app-types/entity";

export interface Relation {
    type: 'belongsTo' | 'hasMany' | 'hasOne' | 'belongsToMany';
    table: string;
    localKey: string;
    foreignKey: string;
    pivotTable?: string; // Para belongsToMany
}

export interface Model<T extends BaseEntity> {
    table: string,
    create: (data: CreateData<T>, options: QueryFields<T>) => Promise<OutputData<T>> ,
    findAll: ( options: QueryFields<T> ) => Promise<OutputData<T>[]>,
    findAllPaginated: ( options: QueryFields<T> ) => Promise<PaginatedResult<T>>,
    findById: (id: number | string, options: QueryFields<T>) => Promise<OutputData<T> | undefined>,
    findBy: (options: QueryFields<T>) => Promise<OutputData<T>[] | undefined>,
    findByPaginated: (options: QueryFields<T>) => Promise<PaginatedResult<T>>,
    update: (id: number | string, data: UpdateData<T>, options: QueryFields<T>) => Promise<OutputData<T>>,
    delete: (id: number | string, options?: QueryFields<T>) => Promise<boolean>,
    forceDelete: (id: number | string, options?: QueryFields<T>) => Promise<boolean>,
    count: (options?: QueryFields<T>) => Promise<number>,
    selectAbleFields: (keyof T)[],
    defaultFields: (keyof T)[],
    excludedFields: (keyof T)[],
    metadata: () => Promise<Metadata> | null,
    relations?: Record<string, Relation>
}