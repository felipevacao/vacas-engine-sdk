import { UpdateData, ErrorContext, OutputData, QueryFields, KnexTable } from '@app-types';
import { db, ErrorHandler, validateSchema } from '@utils';
import { BaseEntity } from '@interfaces';
import { metadata } from '@services';

export const updateBulk = <T extends BaseEntity>(table: string) => {
    return async (
        ids: (number | string)[],
        data: UpdateData<T>,
        options: QueryFields<T> = {}
    ): Promise<OutputData<T>[]> => {
        const context = {} as ErrorContext;
        context.entity = table;
        context.ids = ids;

        return await db.transaction(async (trx) => {
            try {
                const tableMetadata = await metadata(table, true)();

                // Validação para os dados de atualização (aplica ao conjunto ou item-a-item)
                if (tableMetadata) {
                    validateSchema(data as any, tableMetadata.fields.map((f: { name: any }) => f.name), table);
                }

                const updateData: Partial<T> = {
                    ...data,
                    updatedAt: new Date()
                } as Partial<T>;

                const results = await trx<KnexTable<T>>(table)
                    .whereIn('id', ids as any[])
                    .update(updateData as any)
                    .returning(options.fields ? options.fields.map(String) : '*');

                return results as OutputData<T>[];
            } catch (error) {
                throw ErrorHandler.handleDatabaseError(error, context);
            }
        });
    };
};
