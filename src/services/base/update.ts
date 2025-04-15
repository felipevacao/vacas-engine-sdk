import { db } from '../../utils/db'
import { BaseEntity, UpdateData } from '../../types/entity'

export const update = <T extends BaseEntity>(table: string) => {
  return async (id: number, data: UpdateData<T>): Promise<T> => {
    const updateData = {
      ...data,
      updatedAt: new Date()
    }
    const [result] = await db(table).where({ id }).update(updateData).returning('*')
    if (!result) {
      throw new Error(`Record with ID ${id} not found in table ${table}`);
    }
    return result
  }
}