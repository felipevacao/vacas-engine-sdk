import { BaseEntity, CreateData, UpdateData, ReadData } from "../entity";

export interface Model<T extends BaseEntity> {
    table: string,
    create: (data: CreateData<T>) => Promise<ReadData<T>> ,
    findAll: () => Promise<T[]>,
    findById: (id: number) => Promise<ReadData<T> | undefined>,
    findBy: (query: Partial<T>) => Promise<ReadData<T>[] | undefined>,
    update: (id: number, data: UpdateData<T>) => Promise<T>,
    delete: (id: number) => Promise<ReadData<T>>,
    forceDelete: (id: number) => Promise<boolean>,
}