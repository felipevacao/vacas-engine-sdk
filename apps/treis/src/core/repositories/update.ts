import { db, apiError, ErrorHandler, validateSchema, applyFilters } from '@utils'
import { UpdateData, OutputData, QueryFields, ErrorContext, KnexTable } from '@app-types'
import { MESSAGES, HttpStatus } from '@constants'
import { BaseEntity } from '@interfaces'
import { env } from 'process'
import { metadata, AuditService } from '@services'

export const update = <T extends BaseEntity>(table: string) => {

	return async (
		id: number | string,
		data: UpdateData<T>,
		options: QueryFields<T> = {}
	): Promise<OutputData<T>> => {

		const context = {} as ErrorContext
		context.entity = table
		context.id = id

		try {
			const tableMetadata = await metadata(table, true)();
			if (tableMetadata) {
				validateSchema(data as any, tableMetadata.fields.map((f: { name: any }) => f.name), table);
			}

			// 1. Busca estado anterior para o snapshot (Snapshotting)
			const oldData = await db(table).where('id', id).first();

			const updateData: Partial<T> = {
				...data,
				updatedAt: new Date()
			} as Partial<T>;

			const query = db<KnexTable<T>>(table)
				.where('id', '=', id as string | number)
				.update(updateData as any)
				.returning(options.fields ? options.fields.map(String) : '*');

			applyFilters(query, options);

			if (env.NODE_ENV === 'development') {
				context.details = [query.toQuery()]
			}
			const result = await query as unknown as OutputData<T>[];

			if (!result || result.length === 0) {
				throw new apiError(
					MESSAGES.DATABASE.ENTITY.NOT_FOUND,
					HttpStatus.NOT_FOUND,
					context
				);
			}

			// 2. Grava o log de auditoria com o snapshot
			await AuditService.log({
				tableName: table,
				entityId: id,
				action: 'UPDATE',
				oldData: oldData,
				newData: result[0]
			});

			return result[0];
		} catch (error) {
			if (error instanceof apiError) throw error;
			throw ErrorHandler.handleDatabaseError(error, context);
		}

	}
}
