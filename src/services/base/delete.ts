import { db } from '../../utils/db'
import { BaseEntity, ReadData } from '../../types/entity'

/* SOFT DELETE */
export const deleteById = <T extends BaseEntity>(table: string) => {
  const excludeTimestamps = <T extends BaseEntity>(entity: T): ReadData<T> => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { createdAt, updatedAt, deletedAt, ...rest } = entity
      return rest
  }

  return async (id: number): Promise<ReadData<T>> => {
    const deleteData = {
      deletedAt: new Date()
    }
    const [result] = await db(table)
                            .where({ id })
                            .update(deleteData)
                            .returning('*')
    if (!result) {
      throw new Error(`Record with ID ${id} not found in table ${table}`);
    }
    return excludeTimestamps(result)
  }
}

export const forceDelete = (table: string) => {
  return async (id: number): Promise<boolean> => {
    const [result] = await db(table)
                            .where({ id })
                            .del()
                            .returning('*')
    if (!result) {
      throw new Error(`Record with ID ${id} not found in table ${table}`);
    }
    return true
  }
}