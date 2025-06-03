import { BaseEntity, CreateData, UpdateData, OutputData, QueryFields } from "../entity";

export interface Model<T extends BaseEntity> {
    table: string,
    create: (data: CreateData<T>, options: QueryFields<T>) => Promise<OutputData<T>> ,
    findAll: ( options: QueryFields<T> ) => Promise<OutputData<T>[]>,
    findById: (id: number, options: QueryFields<T>) => Promise<OutputData<T> | undefined>,
    findBy: (options: QueryFields<T>) => Promise<OutputData<T>[] | undefined>,
    update: (id: number, data: UpdateData<T>, options: QueryFields<T>) => Promise<OutputData<T>>,
    delete: (id: number) => Promise<boolean>,
    forceDelete: (id: number) => Promise<boolean>
    selectAbleFields: (keyof T)[],
    defaultFields: (keyof T)[],
    excludedFields: (keyof T)[],
}