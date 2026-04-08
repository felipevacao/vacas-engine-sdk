import { MESSAGES } from '@constants/messages/index';
import { ResponseHandler } from '@utils/responseHandler';
import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { apiError } from '@utils/error';
import { Logger } from '@utils/log';

/**
 * Middleware to handle not found routes.
 * @param res - The Express response object.
 * @param message - Optional custom message for the not found error.
 */
export const notFound = (
	res: Response,
	message = MESSAGES.DATABASE.ENTITY.NOT_FOUND
) => {
	ResponseHandler.error(
		res,
		message,
		404
	);
};

/**
 * Middleware to handle route not found errors.
 * @param req - The Express request object.
 * @param res - The Express response object.
 */
export const routeNotFound = (
	req: Request,
	res: Response
) => {
	notFound(res);
};

/**
 * Middleware to handle internal server errors.
 * Logs the error and sends a generic error response.
 * @param err - The error object.
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param _next - The next function (MANDATORY 4 ARGUMENTS FOR EXPRESS ERROR HANDLER).
 */
export const errorHandler: ErrorRequestHandler = (
	err: unknown,
	req: Request,
	res: Response,
	_next: NextFunction
) => {
	void _next; // Silencia o aviso de parâmetro não utilizado, mantendo a assinatura do Express
	
	const errorMessage = (err as Error).message || 'No message provided';

	// Extrai o contexto do erro se ele for uma instância de apiError
	const context = err instanceof apiError ? err.details : undefined;
	
	// Registra o erro no arquivo de log com o contexto (Entity, ID, etc) se disponível
	Logger.error(`Erro na requisição ${req.method} ${req.originalUrl}`, err, context);

	if (err instanceof apiError) {
		ResponseHandler.error(
			res,
			err.errorText,
			err.code,
			err.details
		);
		return;
	}

	// Resposta para erros genéricos (500)
	ResponseHandler.error(
		res,
		MESSAGES.ERROR.INTERNAL_ERROR,
		500,
		{ details: [errorMessage] }
	);
};
