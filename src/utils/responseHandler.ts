// utils/response-handler.ts
import { Response } from 'express';
import { ApiResponse } from '@app-types/response';
import env from "@libs/env"
import { MESSAGES, sMessage, getMessage } from '@constants/messages';
import { apiError } from './error';

export class ResponseHandler {
	/**
	 * Resposta de sucesso	 * Envia uma resposta JSON com os dados fornecidos, uma mensagem opcional e um status code (padrão 200).
	 * O objeto de resposta inclui um campo "success" definido como true, os dados fornecidos, a mensagem e metadados como timestamp e requestId.
	 */
	static success<T>(
		res: Response,
		data?: T,
		text: sMessage = MESSAGES.API.SUCCESS,
		statusCode: number = 200,
		headers?: Record<string, string>
	): Response<ApiResponse<T>> {
		const response: ApiResponse<T> = {
			success: true,
			message: text.message,
			data,
			meta: {
				timestamp: new Date().toISOString(),
				requestId: res.locals.requestId
			}
		};
		if (headers) {
			for (const [key, value] of Object.entries(headers)) {
				res.header(key, value);
			}
		}

		return res.status(statusCode).json(response);
	}

	/**
	 * Resposta de erro
	 * Envia uma resposta JSON de erro com uma mensagem, um código de erro, um status code (padrão 400) e detalhes opcionais.
	 * O objeto de resposta inclui um campo "success" definido como false, a mensagem de erro, um objeto "error" com o código e os detalhes do erro, e metadados como timestamp e requestId.
	 * O campo "details" do objeto de erro pode conter informações adicionais sobre o erro, como a pilha de erros (stack trace) se o ambiente permitir.
	 * O código de erro é uma string que representa o tipo específico de erro ocorrido, permitindo uma melhor identificação e tratamento dos erros no cliente.
	 */
	static error(
		res: Response,
		text: sMessage,
		statusCode: number = 400,
		details?: unknown | Error,
		headers?: Record<string, string>
	): Response<ApiResponse> {

		const response: ApiResponse = {
			success: false,
			message: MESSAGES.ERROR.OPERATION_ERROR.message,
			error: {
				code: text.name,
				message: text.message
			},
			meta: {
				timestamp: new Date().toISOString(),
				requestId: res.locals.requestId
			}
		}
		if (env.ENABLE_RETURN_ERRORS && response.error && env.NODE_ENV === 'development') {
			response.error.details = details instanceof apiError ? details.stack : details ?? MESSAGES.ERROR.UNKNOWN.message;
		}
		if (headers) {
			for (const [key, value] of Object.entries(headers)) {
				res.header(key, value);
			}
		}

		return res.status(statusCode).json(response);
	}

	/**
	 * Resposta paginada
	 * Envia uma resposta JSON paginada com os dados fornecidos, informações de paginação e uma mensagem opcional.
	 * O objeto de resposta inclui um campo "success" definido como true, os dados fornecidos, a mensagem, e um campo "meta" que contém informações sobre a requisição e a paginação.
	 */
	static paginated<T>(
		res: Response,
		data: T[],
		pagination: {
			page: number;
			limit: number;
			total: number;
			totalPages: number;
			hasNext: boolean;
			hasPrev: boolean;
		},
		text: sMessage = MESSAGES.API.SUCCESS_DATA,
		headers?: Record<string, string>
	): Response<ApiResponse<T[]>> {
		const totalPages = Math.ceil(pagination.total / pagination.limit);

		const response: ApiResponse<T[]> = {
			success: true,
			message: text.message,
			data,
			meta: {
				timestamp: new Date().toISOString(),
				requestId: res.locals.requestId,
				metadataUrl: res.req.baseUrl + '/metadata',
				pagination: {
					...pagination,
					totalPages
				}
			}
		};

		if (headers) {
			for (const [key, value] of Object.entries(headers)) {
				res.header(key, value);
			}
		}

		return res.status(200).json(response);
	}

	/**
	 * Resposta de não autorizado
	 * Envia uma resposta JSON de erro de não autorizado com uma mensagem opcional e um status code 401.
	 * O objeto de resposta inclui um campo "success" definido como false, a mensagem de erro, um objeto "error" com o código 'UNAUTHORIZED' e detalhes opcionais, e metadados como timestamp e requestId.
	 * O código de erro 'UNAUTHORIZED' é usado para indicar que o acesso ao recurso solicitado é negado devido à falta de credenciais válidas ou permissões insuficientes.
	 */
	static unauthorized(
		res: Response,
		text: sMessage = MESSAGES.ERROR.UNAUTHORIZED,
		headers?: Record<string, string>
	): Response<ApiResponse> {
		return this.error(res, text, 401, headers);
	}

	/**
	 * Resposta de recurso não encontrado
	 * Envia uma resposta JSON de erro de recurso não encontrado com uma mensagem que inclui o nome do recurso, um código de erro 'NOT_FOUND' e um status code 404.
	 * O objeto de resposta inclui um campo "success" definido como false, a mensagem de erro, um objeto "error" com o código 'NOT_FOUND' e detalhes opcionais, e metadados como timestamp e requestId.
	 * O código de erro 'NOT_FOUND' é usado para indicar que o recurso solicitado não foi encontrado no servidor, o que pode ocorrer quando o cliente solicita um recurso que não existe ou foi removido.
	 */
	static notFound(
		res: Response,
		resource: string,
		headers?: Record<string, string>
	): Response<ApiResponse> {
		return this.error(
			res,
			{ name: 'NOT_FOUND', message: `${resource} ${getMessage(MESSAGES.ERROR.NOT_FOUND)}` },
			404,
			headers
		);
	}

	/**
	 * Resposta de erro interno
	 * Envia uma resposta JSON de erro interno com uma mensagem opcional e um status code 500.
	 * O objeto de resposta inclui um campo "success" definido como false, a mensagem de erro, um objeto "error" com o código 'INTERNAL_ERROR' e detalhes opcionais, e metadados como timestamp e requestId.
	 * O código de erro 'INTERNAL_ERROR' é usado para indicar que ocorreu um erro inesperado no servidor, o que pode ser causado por problemas na lógica do aplicativo ou em recursos externos.
	 */
	static internal(
		res: Response,
		text: sMessage = MESSAGES.ERROR.INTERNAL_ERROR,
		headers?: Record<string, string>
	): Response<ApiResponse> {
		return this.error(res, text, 500, headers);
	}
}