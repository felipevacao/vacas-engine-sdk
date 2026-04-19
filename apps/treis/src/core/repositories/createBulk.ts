import { CreateData, ErrorContext, OutputData, QueryFields, KnexTable } from '@app-types';
import { db, ErrorHandler, validateSchema } from '@utils';
import { BaseEntity } from '@interfaces';
import { metadata } from '@services';

export const createBulk = <T extends BaseEntity>(table: string) => {
    return async (
        data: CreateData<T>[],
        options: QueryFields<T> = {}
    ): Promise<OutputData<T>[]> => {
        const context = {} as ErrorContext;
        context.entity = table;

        return await db.transaction(async (trx) => {
            try {
                const tableMetadata = await metadata(table, true)();
                
                // Validação individual para cada item do array
                if (tableMetadata) {
                    for (const item of data) {
                        validateSchema(item as any, tableMetadata.fields.map((f: { name: any }) => f.name), table);
                    }
                }

                const results = await trx<KnexTable<T>>(table)
                    .insert(data as any)
                    .returning(options.fields ? options.fields.map(String) : '*');

                return results as OutputData<T>[];
            } catch (error) {
                throw ErrorHandler.handleDatabaseError(error, context);
            }
        });
    };
};