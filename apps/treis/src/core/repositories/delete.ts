import { db } from "@utils/db";
import { ErrorHandler } from "@utils/ErrorHandler";
import { apiError } from "@utils/error";
import { MESSAGES } from "@constants/messages";
import { BaseEntity, ErrorContext, QueryFields, KnexTable } from "@app-types/entity";
import { HttpStatus } from "@constants/HttpStatus";
import { applyFilters } from "@utils/knexUtils";

export const deleteById = <T extends BaseEntity>(table: string) => {
	return async (id: number | string, options: QueryFields<T> = {}): Promise<boolean> => {
		const context = {} as ErrorContext
		context.entity = table
		context.id = id
		try {
			const deleteData: Partial<T> = {
				deletedAt: new Date(),
			} as Partial<T>;

			const query = db<KnexTable<T>>(table)
				.where('id', '=', id as string | number)
				.whereNull('deletedAt')
				.update(deleteData as any)
				.returning("*");

			applyFilters(query, options);

			const result = await query;
			if (!result || (Array.isArray(result) && result.length === 0)) {
				throw new apiError(
					MESSAGES.DATABASE.ENTITY.NOT_FOUND,
					HttpStatus.NOT_FOUND,
					context
				);
			}
			return true;
		} catch (error) {
			if (error instanceof apiError) throw error;
			throw ErrorHandler.handleDatabaseError(error, context);
		}
	};
};

export const forceDelete = <T extends BaseEntity>(table: string) => {
	return async (id: number | string, options: QueryFields<T> = {}): Promise<boolean> => {
		const context = {} as ErrorContext
		context.entity = table
		context.id = id
		try {
			const query = db<KnexTable<T>>(table)
				.where('id', '=', id as string | number)
				.whereNotNull("deletedAt")
				.del()
				.returning("*");

			applyFilters(query, options);

			const result = await query;
			if (!result || (Array.isArray(result) && result.length === 0)) {
				throw new apiError(
					MESSAGES.DATABASE.ENTITY.NOT_FOUND,
					HttpStatus.NOT_FOUND,
					context
				);
			}
			return true;
		} catch (error) {
			if (error instanceof apiError) throw error;
			throw ErrorHandler.handleDatabaseError(error, context);
		}
	};
};
