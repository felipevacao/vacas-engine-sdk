import { db } from '@utils/db'
import { BaseEntity, UpdateData, OutputData, QueryFields, ErrorContext } from 'types/entity'
import { ErrorHandler } from '@utils/ErrorHandler'
import { apiError } from '@utils/error'
import { MESSAGES } from '@constants/messages'
import { HttpStatus } from '@constants/HttpStatus'

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
			const updateData = {
				...data,
				updatedAt: new Date()
			}
			let query = db(table)
				.where({ id })
				.update(updateData)
				.returning(options.fields ? options.fields.map(String) : '*')
			if (options.filters) {
				options.filters.forEach(filter => {
					query = query.where(filter.field, filter.operator, filter.value);
				});
			}

			context.details = [query.toQuery()]
			const [result] = await query;
			if (!result) {
				throw new apiError(
					MESSAGES.DATABASE.ENTITY.NOT_FOUND,
					HttpStatus.NOT_FOUND,
					context
				);
			}
			return result;
		} catch (error) {
			if (error instanceof apiError) throw error;
			throw ErrorHandler.handleDatabaseError(error, context);
		}

	}
}