import { db } from '@utils/db'

/* SOFT DELETE */
export const deleteById = (table: string) => {

  return async (id: number): Promise<boolean> => {
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
    return true
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