import { db } from '@utils/db'
import { BaseEntity, CreateData, ErrorContext, OutputData, QueryFields, KnexTable } from '@app-types/entity'
import { ErrorHandler } from '@utils/ErrorHandler'
import { metadata } from '@services/metadata'
import { validateSchema } from '@utils/schemaGuard'

export const create = <T extends BaseEntity>(table: string) => {

    return async (
        data: CreateData<T>,
        options: QueryFields<T> = {}
    ): Promise<OutputData<T>> => {
        const context = {} as ErrorContext
        context.entity = table
        try {
            const tableMetadata = await metadata(table)();
            if (tableMetadata) {
                validateSchema(data as any, tableMetadata.fields.map(f => f.column_name), table);
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
