import { db } from '../../utils/db'
import { BaseEntity, CreateData, ReadData } from '../../types/entity'

export const create = <T extends BaseEntity>(table: string) => {

    const excludeTimestamps = <T extends BaseEntity>(entity: T): ReadData<T> => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { createdAt, updatedAt, deletedAt, ...rest } = entity
        return rest
    }

    return async (data: CreateData<T>): Promise<ReadData<T>> => {
        const [result] = await db(table)
                                .insert(data)
                                .returning('*')
        return excludeTimestamps(result);
    }
}