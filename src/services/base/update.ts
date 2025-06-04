import { db } from '@utils/db'
import { BaseEntity, UpdateData, OutputData, QueryFields } from 'types/entity'

export const update = <T extends BaseEntity>(table: string) => {
  
  return async (id: number, data: UpdateData<T>, options: QueryFields<T> = {}): Promise<OutputData<T>> => {
    const updateData = {
      ...data,
      updatedAt: new Date()
    }
    const [result] = await db(table)
                            .where({ id })
                            .update(updateData)
                            .returning(options.fields ? options.fields.map(String) : '*')
    if (!result) {
      throw new Error(`Record with ID ${id} not found in table ${table}`);
    }
    return result;
  }}