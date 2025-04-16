import { db } from '../../utils/db'
import { BaseEntity, ReadData } from '../../types/entity'

export const read = <T extends BaseEntity>(table: string) => {

    const excludeTimestamps = <T extends BaseEntity>(entity: T): ReadData<T> => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { createdAt, updatedAt, deletedAt, ...rest } = entity
        return rest
    }

    const findAll = async (): Promise<ReadData<T>[]> => {
        return db(table)
                .whereNull('deletedAt')
                .select('*')
                .then(rows => rows.map(excludeTimestamps))
    }

    const findById = async (id: number): Promise<ReadData<T> | undefined> => {
        return db(table)
                .where({ id })
                .whereNull('deletedAt')
                .first()
                .then(result => result ? excludeTimestamps(result) : undefined)
    }

    const findBy = async (filters: Partial<T>): Promise<ReadData<T>[] | undefined> => {
        return db(table)
                .where(filters)
                .whereNull('deletedAt')
                .select('*')
                .then(rows => rows.map(excludeTimestamps))
    }

    return { findAll, findById, findBy }
}