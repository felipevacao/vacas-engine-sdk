import { MESSAGES } from '@constants/messages/index'
import { SessionController } from '@controllers/SessionController'
import { ResponseHandler } from '@utils/responseHandler'
import { Request, Response, NextFunction } from 'express'
import { Session, SessionData } from 'express-session'

/**
 * 
 * Middleware para validar o token de autenticação em rotas protegidas.
 * Verifica se o token está presente no header Authorization, valida o token e, se válido, adiciona as informações da sessão ao objeto de requisição.
 * Em caso de erro, retorna uma resposta JSON com a mensagem de erro apropriada.
 */
export const tokenMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {

	const authHeader = req.headers.authorization

	/**
	 * VERIFICAÇÃO DO TOKEN - INICIO
	 * Verificar se o token está presente no header Authorization e se segue o formato
	 */
	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		res.status(401).json({
			success: false,
			error: MESSAGES.ERROR.MISSING_TOKEN,
			code: 'MISSING_TOKEN'
		})
		return
	}
	const token = authHeader?.split(' ')[1]
	if (!token) {
		res.status(401).json({
			success: false,
			error: MESSAGES.ERROR.MISSING_TOKEN,
			code: 'MISSING_TOKEN'
		})
	}
	/**
	 * VERIFICAÇÃO DO TOKEN - FIM
	 */

	try {
		/**
		 * VALIDAÇÃO DO TOKEN
		 * Validar o token usando o SessionController e obter as informações do usuário e da sessão.
		 * Se a sessão ou o usuário não forem encontrados, retornar um erro de sessão inválida.
		 * Se a validação for bem-sucedida, adicionar as informações da sessão ao objeto de requisição e chamar o próximo middleware ou rota.
		 */
		const sessionController = new SessionController()
		const [user, session] = await sessionController.validateUser(token as string, '127.0.0.1')
		if (!session || !user) {
			res.status(401).json({
				success: false,
				error: MESSAGES.ERROR.INVALID_SESSION,
				code: 'INVALID_SESSIONS'
			})
		}

		/**
		 * Informações da sessão adicionadas ao objeto de requisição para uso em rotas protegidas.
		 * O tipo SessionData é usado para garantir que as propriedades sessionId e userId estejam presentes no objeto de sessão.
		 */
		req.session = {
			sessionId: session.id,
			userId: user.id as number,
		} as Session & Partial<SessionData>

		next()

	} catch (error) {
		handleTokenError(error as Error, res)

	}

}
/**
 * Middleware para verificar se já existe um token válido na requisição.
 * Se um token válido for encontrado, retorna uma resposta JSON indicando que uma sessão ativa foi encontrada, junto com a data de expiração do token.
 * Se nenhum token válido for encontrado, chama o próximo middleware ou rota.
 */
export const checkExistingToken = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {

	const authHeader = req.headers.authorization

	if (authHeader && authHeader.startsWith('Bearer ')) {
		const token = authHeader?.split(' ')[1]
		if (token) {
			try {
				const sessionController = new SessionController()
				const [user, session] = await sessionController.validateUser(token as string, '127.0.0.1')
				if (session && user) {
					ResponseHandler.success(res, {
						mensagem: 'Sessão ativa encontrada',
						expiresAt: session.expiresAt,
					}, 'Token válido')
					return
				}
			} catch (error) {
				handleTokenError(error as Error, res)
			}
		}
	}

	next()

} 

/**
 * Função para lidar com erros durante a validação do token.
 */
function handleTokenError(
	error: Error,
	res: Response
) {
	if (error.name === 'InvalidSessionError') {
		return ResponseHandler.error(
			res,
			MESSAGES.ERROR.INVALID_CREDENTIALS,
			'INVALID_CREDENTIALS',
			401
		)
	}

	return ResponseHandler.error(
		res,
		MESSAGES.ERROR.TOKEN_VALIDATION_ERROR,
		'INTERNAL_ERROR',
		500,
		error as Error
	)
}