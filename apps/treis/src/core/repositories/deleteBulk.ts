import { ErrorContext, QueryFields, KnexTable } from '@app-types';
import { db, ErrorHandler } from '@utils';
import { BaseEntity } from '@interfaces';

export const deleteBulk = <T extends BaseEntity>(table: string) => {
    return async (
        ids: (number | string)[],
        options: QueryFields<T> = {}
    ): Promise<boolean> => {
        const context = {} as ErrorContext;
        context.entity = table;
        context.ids = ids;

        return await db.transaction(async (trx) => {
            try {
                const deleteData: Partial<T> = {
                    deletedAt: new Date(),
                } as Partial<T>;

                const query = trx<KnexTable<T>>(table)
                    .whereIn('id', ids as any[])
                    .whereNull('deletedAt')
                    .update(deleteData as any);

                const result = await query;
                
                // Retorna verdadeiro se pelo menos um registro foi afetado
                return (result as number) > 0;
            } catch (error) {
                throw ErrorHandler.handleDatabaseError(error, context);
            }
        });
    };
};
