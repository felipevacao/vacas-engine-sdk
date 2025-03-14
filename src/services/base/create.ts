import { db } from '../../utils/db'
import { BaseEntity } from '../../types/entity'

export const create = <T extends BaseEntity>(table: string) => {
    return async (data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T> => {
        console.log(data)
        const [result] = await db(table).insert(data).returning('*');
        return result as T;
    }
}

// export default create