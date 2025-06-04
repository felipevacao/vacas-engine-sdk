import { db } from '@utils/db'
import { BaseEntity, OutputData, QueryFields } from 'types/entity'

export const read = <T extends BaseEntity>(table: string) => {

    const findAll = async ( options: QueryFields<T> = {} ): Promise<OutputData<T>[]> => {
        
        const result = db(table)
                .select(options.fields || '*')
                .whereNull('deletedAt')
        return result
    }

    const findById = async (id: number, options: QueryFields<T> = {} ): Promise<OutputData<T> | undefined> => {
        return db(table)
                .select(options.fields || '*')
                .where({ id })
                .whereNull('deletedAt')
                .first()
    }

    const findBy = async (options: QueryFields<T>): Promise<OutputData<T>[] | undefined> => {
        return db(table)
                .select(options.fields || '*')
                .where(options.where || {})
                .whereNull('deletedAt')
    }

    return { findAll, findById, findBy }
}