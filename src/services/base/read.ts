import { db } from '../../utils/db'
import { BaseEntity, ReadData } from '../../types/entity'

export const read = <T extends BaseEntity>(table: string) => {
    const findAll = async (): Promise<ReadData<T>[]> => {
        return db(table).whereNull('deletedAt').select('*');
    };

    const findById = async (id: number): Promise<ReadData<T> | undefined> => {
        return db(table).where({ id }).whereNull('deletedAt').first();
    };

    const findBy = async (filters: Partial<T>): Promise<ReadData<T>[] | undefined> => {
        return db(table).where(filters).whereNull('deletedAt').select('*');
    };

    return { findAll, findById, findBy };
};