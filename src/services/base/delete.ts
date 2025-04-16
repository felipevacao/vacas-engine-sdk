import { db } from '../../utils/db'
import { BaseEntity } from '../../types/entity'

/* SOFT DELETE */
export const deleteById = <T extends BaseEntity>(table: string) => {
  return async (id: number): Promise<T> => {
    const deleteData = {
      deletedAt: new Date()
    }
    const [result] = await db(table).where({ id }).update(deleteData).returning('*')
    if (!result) {
      throw new Error(`Record with ID ${id} not found in table ${table}`);
    }
    return result
  }
}

export const forceDelete = <T extends BaseEntity>(table: string) => {
  return async (id: number): Promise<T> => {
    const [result] = await db(table).where({ id }).del().returning('*')
    if (!result) {
      throw new Error(`Record with ID ${id} not found in table ${table}`);
    }
    return result
  }
}

// import { db } from '../../utils/db'

// const deleteById = (table: string) => {
//   return async (id: number) => {
//     const [result] = await db(table).where({ id }).del().returning('*')
//     return result
//   }
// }

// export default deleteById