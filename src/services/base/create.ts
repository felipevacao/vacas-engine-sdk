import { db } from '@utils/db'
import { BaseEntity, CreateData, OutputData, QueryFields } from 'types/entity'

export const create = <T extends BaseEntity>(table: string) => {

    /**
     * Função de criação genérica para inserir um novo registro em uma tabela específica do banco de dados.
     * Aceita os dados a serem inseridos e opções de consulta para personalizar os campos retornados.
     */
    return async (
        data: CreateData<T>, 
        options: QueryFields<T> = {}
    ): Promise<OutputData<T>> => {

        const [result] = await db(table)
                                .insert(data)
                                .returning(options.fields ? options.fields.map(String) : '*')
        return result;
        
    }
}