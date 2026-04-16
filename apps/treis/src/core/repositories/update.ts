import { db } from '@utils/db'
import { BaseEntity, UpdateData, OutputData, QueryFields, ErrorContext, KnexTable } from '@app-types/entity'
import { ErrorHandler } from '@utils/ErrorHandler'
import { apiError } from '@utils/error'
import { MESSAGES } from '@constants/messages'
import { HttpStatus } from '@constants/HttpStatus'
import { env } from 'process'
import { applyFilters } from '@utils/knexUtils'
import { metadata } from '@services/metadata'
import { validateSchema } from '@utils/schemaGuard'

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
            const tableMetadata = await metadata(table)();
            if (tableMetadata) {
                validateSchema(data as any, tableMetadata.fields.map(f => f.column_name), table);
            }

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
			return result[0];
		} catch (error) {
			if (error instanceof apiError) throw error;
			throw ErrorHandler.handleDatabaseError(error, context);
		}

	}
}
