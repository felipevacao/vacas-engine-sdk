import { Request, Response, NextFunction } from 'express';
import { getClientIP } from '@utils';

/**
 * Middleware para logar as requisições recebidas.
 * Usado em ambiente DEVELOPMENT para facilitar o monitoramento das requisições e depuração.
 * @param req Objeto de requisição do Express.
 * @param res Objeto de resposta do Express.
 * @param next Função do próximo middleware.
 */
export const logging = (req: Request, res: Response, next: NextFunction) => {

	// Adiciona IP ao objeto req para uso posterior
	req.clientIP = getClientIP(req);
	console.log(`[${new Date().toISOString()}] IP: ${req.clientIP} - ${req.method} ${req.url}`);

	next()
}