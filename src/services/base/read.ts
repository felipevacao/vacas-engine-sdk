import { db } from '../../utils/db'
import { BaseEntity } from '../../types/entity'

export const read = <T extends BaseEntity>(table: string) => {
    const findAll = async (): Promise<T[]> => {
        return db(table).select('*');
    };

    const findById = async (id: number): Promise<T | undefined> => {
        return db(table).where({ id }).first();
    };

    const findBy = async (filters: Partial<T>): Promise<T[]> => {
        return db(table).where(filters).select('*');
    };

    return { findAll, findById, findBy };
};