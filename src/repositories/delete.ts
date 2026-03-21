import { db } from "@utils/db";
import { ErrorHandler } from "@utils/ErrorHandler";
import { apiError } from "@utils/error";
import { MESSAGES } from "@constants/messages";
import { ErrorContext } from "types/entity";
import { HttpStatus } from "@constants/HttpStatus";

export const deleteById = (table: string) => {
	/**
   * Função de exclusão genérica para marcar um registro como deletado em uma tabela específica do banco de dados.
   * Em vez de remover fisicamente o registro, ela atualiza o campo 'deletedAt' com a data atual, permitindo a recuperação futura dos dados se necessário.
   * Retorna um booleano indicando se a operação foi bem-sucedida ou se o registro não foi encontrado.
   * soft delete
   */
	return async (id: number | string): Promise<boolean> => {
		const context = {} as ErrorContext
		context.entity = table
		context.id = id
		try {
			const deleteData = {
				deletedAt: new Date(),
			};
			const [result] = await db(table)
				.where({ id })
				.update(deleteData)
				.returning("*");
			if (!result) {
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

/**
 * Função de exclusão forçada para remover permanentemente um registro de uma tabela específica do banco de dados.
 * Esta função realiza uma exclusão física, eliminando completamente o registro do banco de dados.
 * Somente registros que já foram marcados como deletados (com 'deletedAt' não nulo) serão removidos, garantindo que apenas os registros que passaram pelo processo
 * de exclusão suave sejam eliminados permanentemente.
 */
export const forceDelete = (table: string) => {
	return async (id: number | string): Promise<boolean> => {
		const context = {} as ErrorContext
		context.entity = table
		context.id = id
		try {
			const [result] = await db(table)
				.where({ id })
				.whereNotNull("deletedAt")
				.del()
				.returning("*");
			if (!result) {
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

