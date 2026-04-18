import { CreateData, ErrorContext, OutputData, QueryFields, KnexTable } from '@app-types'
import { db, ErrorHandler, validateSchema } from '@utils'
import { BaseEntity } from '@interfaces'
import { metadata } from '@services'

export const create = <T extends BaseEntity>(table: string) => {

    return async (
        data: CreateData<T>,
        options: QueryFields<T> = {}
    ): Promise<OutputData<T>> => {
        const context = {} as ErrorContext
        context.entity = table
        try {
            const tableMetadata = await metadata(table, true)();
            if (tableMetadata) {
                validateSchema(data as any, tableMetadata.fields.map((f: { name: any }) => f.name), table);
            }

            const result = await db<KnexTable<T>>(table)
                .insert(data as any)
                .returning(options.fields ? options.fields.map(String) : '*');

            return result[0] as OutputData<T>;
        } catch (error) {
            throw ErrorHandler.handleDatabaseError(error, context);
        }

    }
}
