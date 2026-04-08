import { db } from '@utils/db'
import { BaseEntity, CreateData, ErrorContext, OutputData, QueryFields } from '@app-types/entity'
import { ErrorHandler } from '@utils/ErrorHandler'

export const create = <T extends BaseEntity>(table: string) => {

    /**
     * Função de criação genérica para inserir um novo registro em uma tabela específica do banco de dados.
     * Aceita os dados a serem inseridos e opções de consulta para personalizar os campos retornados.
     */
    return async (
        data: CreateData<T>,
        options: QueryFields<T> = {}
    ): Promise<OutputData<T>> => {
        const context = {} as ErrorContext
        context.entity = table
        try {
            const [result] = await db(table)
                .insert(data)
                .returning(options.fields ? options.fields.map(String) : '*')
            return result;
        } catch (error) {
            throw ErrorHandler.handleDatabaseError(error, context);
        }

    }
}