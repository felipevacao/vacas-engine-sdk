import { MESSAGES } from '@constants/messages/index';
import { ResponseHandler } from '@utils/responseHandler';
import { Request, Response } from 'express';

/**
 * Middleware to handle not found routes.
 * @param res - The Express response object.
 * @param message - Optional custom message for the not found error.
 */
export const notFound = (
	res: Response,
	message: string = 'Rota não encontrada.'
) => {

	ResponseHandler.error(
		res,
		message,
		MESSAGES.ERROR_CODES.NOT_FOUND,
		404
	)

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

	notFound(res, 'Rota não encontrada.');

};

/**
 * Middleware to handle internal server errors.
 * Logs the error and sends a generic error response.
 * @param err - The error object.
 * @param req - The Express request object.
 * @param res - The Express response object.
 */
export const errorHandler = (
	err: Error,
	req: Request,
	res: Response
) => {

	console.error('Erro:', err.message);
	res.status(500).json({ error: 'Algo deu errado.' })
	ResponseHandler.error(
		res,
		err.message || 'Erro interno do servidor.',
		MESSAGES.ERROR_CODES.INTERNAL_ERROR,
		500
	);

};
