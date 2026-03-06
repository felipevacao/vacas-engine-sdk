import { Request, Response, NextFunction } from 'express';

/**
 * Middleware para logar as requisições recebidas.
 * Usado em ambiente DEVELOPMENT para facilitar o monitoramento das requisições e depuração.
 * @param req Objeto de requisição do Express.
 * @param res Objeto de resposta do Express.
 * @param next Função do próximo middleware.
 */
export const logging = (req: Request, res: Response, next: NextFunction) => {
	console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`)
	next()
}