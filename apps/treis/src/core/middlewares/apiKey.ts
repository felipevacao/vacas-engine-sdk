import { Request, Response, NextFunction } from 'express'
import { apiError, cryptoUtils } from '@utils'
import { MESSAGES } from '@constants'

/**
 * Middleware para validar a presença e a validade da chave de API (x-api-key).
 * Ideal para autenticação Server-to-Server (ex: Verona -> Treis).
 */
export const apiKeyMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const apiKey = req.headers['x-api-key']

    // Valida se a chave existe e se corresponde à variável de ambiente configurada
    if (!apiKey || apiKey !== process.env.VERONA_API_KEY) {
        // Retorna 403 Forbidden para requisições com chave inválida ou ausente
        cryptoUtils.handleTokenError(new apiError(MESSAGES.ERROR.ERROR_API_KEY, 403), res)
        return
    }

    next()
}
