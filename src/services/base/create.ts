import { db } from '../../utils/db'
import { BaseEntity, CreateData, OutputData, QueryFields } from '../../types/entity'

export const create = <T extends BaseEntity>(table: string) => {

    return async (data: CreateData<T>, options: QueryFields<T> = {}): Promise<OutputData<T>> => {
        const [result] = await db(table)
                                .insert(data)
                                .returning(options.fields ? options.fields.map(String) : '*')
        return result;
    }
}