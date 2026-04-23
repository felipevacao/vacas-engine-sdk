import { ErrorContext, QueryFields, KnexTable } from "@app-types";
import { db, apiError, ErrorHandler, applyFilters } from "@utils";
import { MESSAGES, HttpStatus } from "@constants";
import { BaseEntity } from "@interfaces";
import { AuditService } from "@services";

export const restoreById = <T extends BaseEntity>(table: string) => {
	return async (id: number | string, options: QueryFields<T> = {}): Promise<boolean> => {
		const context = {} as ErrorContext
		context.entity = table
		context.id = id
		try {
			const restoreData: Partial<T> = {
				deletedAt: null,
			} as any;

			const query = db<KnexTable<T>>(table)
				.where('id', '=', id as string | number)
				.whereNotNull('deletedAt')
				.update(restoreData as any)
				.returning("*");

			applyFilters(query, options);

			const result = await query as unknown as T[];
			
			if (!result || result.length === 0) {
				throw new apiError(
					MESSAGES.DATABASE.ENTITY.NOT_FOUND,
					HttpStatus.NOT_FOUND,
					context
				);
			}

            // Log de Auditoria da Restauração
            await AuditService.log({
                tableName: table,
                entityId: id,
                action: 'RESTORE',
                newData: result[0]
            });

			return true;
		} catch (error) {
			if (error instanceof apiError) throw error;
			throw ErrorHandler.handleDatabaseError(error, context);
		}
	};
};
