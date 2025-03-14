import { BaseEntity } from "../entity";

export interface Model<T extends BaseEntity> {
    create: (data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>) => Promise<T> ,
    findAll: () => Promise<T[]>,
    findById: (id: number) => Promise<T | undefined>,
    findBy: (query: Partial<T>) => Promise<T[] | undefined>,
}