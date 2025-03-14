import { db } from '../../utils/db'

const update = (table: string) => {
  return async (id: number, data: Record<string, unknown>) => {
    const [result] = await db(table).where({ id }).update(data).returning('*')
    return result
  }
}

export default update