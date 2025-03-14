import { db } from '../../utils/db'

const deleteById = (table: string) => {
  return async (id: number) => {
    const [result] = await db(table).where({ id }).del().returning('*')
    return result
  }
}

export default deleteById