import { db } from '../../utils/db'
import { BaseEntity, CreateData } from '../../types/entity'

export const create = <T extends BaseEntity>(table: string) => {
    return async (data: CreateData<T>): Promise<T> => {
        const [result] = await db(table).insert(data).returning('*');
        return result as T;
    }
}