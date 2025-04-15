import { BaseEntity, CreateData, UpdateData } from "../entity";

export interface Model<T extends BaseEntity> {
    table: string,
    create: (data: CreateData<T>) => Promise<T> ,
    findAll: () => Promise<T[]>,
    findById: (id: number) => Promise<T | undefined>,
    findBy: (query: Partial<T>) => Promise<T[] | undefined>,
    update: (id: number, data: UpdateData<T>) => Promise<T>,
    delete: (id: number) => Promise<T>,
    forceDelete: (id: number) => Promise<T>,
}