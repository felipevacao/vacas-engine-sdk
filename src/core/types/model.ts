import { BaseEntity, CreateData, UpdateData, OutputData, QueryFields, Metadata, PaginatedResult } from "@app-types/entity";

export interface Model<T extends BaseEntity> {
    table: string,
    create: (data: CreateData<T>, options: QueryFields<T>) => Promise<OutputData<T>> ,
    findAll: ( options: QueryFields<T> ) => Promise<OutputData<T>[]>,
    findAllPaginated: ( options: QueryFields<T> ) => Promise<PaginatedResult<T>>,
    findById: (id: number | string, options: QueryFields<T>) => Promise<OutputData<T> | undefined>,
    findBy: (options: QueryFields<T>) => Promise<OutputData<T>[] | undefined>,
    findByPaginated: (options: QueryFields<T>) => Promise<PaginatedResult<T>>,
    update: (id: number | string, data: UpdateData<T>, options: QueryFields<T>) => Promise<OutputData<T>>,
    delete: (id: number | string) => Promise<boolean>,
    forceDelete: (id: number | string) => Promise<boolean>
    selectAbleFields: (keyof T)[],
    defaultFields: (keyof T)[],
    excludedFields: (keyof T)[],
    metadata: () => Promise<Metadata> | null
}