import { db } from '../../utils/db'
import { BaseEntity, UpdateData, ReadData } from '../../types/entity'

export const update = <T extends BaseEntity>(table: string) => {
  const excludeTimestamps = <T extends BaseEntity>(entity: T): ReadData<T> => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { createdAt, updatedAt, deletedAt, ...rest } = entity
      return rest
  }

  return async (id: number, data: UpdateData<T>): Promise<ReadData<T>> => {
    const updateData = {
      ...data,
      updatedAt: new Date()
    }
    const [result] = await db(table)
                            .where({ id })
                            .update(updateData)
                            .returning('*')
    if (!result) {
      throw new Error(`Record with ID ${id} not found in table ${table}`);
    }
    return excludeTimestamps(result);
  }
}