import crypto from 'crypto'
import env from 'libs/env'
import { Request, Response } from 'express'
import { apiError } from './error'
import { MESSAGES } from '@constants/messages'
import { ResponseHandler } from '@utils/responseHandler'

interface TokenConfig {
    tokenBytes?: number      // Padrão: 32
    hashAlgorithm?: string   // Padrão: 'sha256'
    pepper?: string          // Opcional
}

class TokenManager {

    public readonly tokenBytes: number
    public readonly hashAlgorithm: string
    public readonly pepper: string

    constructor(config: TokenConfig = {}) {
        this.tokenBytes = config.tokenBytes || parseInt(env.TOKEN_BYTES)
        this.hashAlgorithm = config.hashAlgorithm || env.TOKEN_ALGOR
        this.pepper = config.pepper || env.TOKEN_PEPPER
    }

}

const manager = new TokenManager()

export const cryptoUtils = {


    /**
     * Gera um token aleatório usando o módulo crypto do Node.js.
     */
    generateToken(): string {
        return crypto.randomBytes(manager.tokenBytes).toString('hex')
    },
    /**
    * Gera um hash de um token usando o algoritmo SHA-256. O hash é retornado como uma string hexadecimal.
     */
    hashToken(token: string): string {
        const pepperedHash = token + manager.pepper
        return crypto.createHash(manager.hashAlgorithm).update(pepperedHash).digest('hex')
    },

    /**
     * Valida o formato e tamanho do Token
     */
    validateToken(
        token: string
    ): boolean {

        if (!token || token === '') {
            return false
        }

        const hexRegex = new RegExp(`^[a-f0-9]{${manager.hashAlgorithm === 'sha256' ? 64 : 128}}$`, 'i')
        if (!hexRegex.test(token)) {
            return false
        }

        return true

    },

    /**
     * Verifica se um token corresponde a um hash usando uma comparação segura contra ataques de timing.
     */
    verifyToken(
        token: string,
        hash: string
    ): boolean {

        if (!token || !hash || typeof token !== 'string' || typeof hash !== 'string') {
            return false
        }

        if (!this.validateToken(hash)) {
            return false
        }

        try {

            // Converte o hash armazenado para Buffer
            const storedBuffer = Buffer.from(hash, 'hex')

            // Gera o hash do token atual
            const tokenBuffer = Buffer.from(this.hashToken(token), 'hex')

            // Verificação de comprimento com proteção contra timing attack
            if (tokenBuffer.length !== storedBuffer.length) {
                crypto.timingSafeEqual(tokenBuffer, storedBuffer)
                return false
            }

            return crypto.timingSafeEqual(tokenBuffer, storedBuffer)

        } catch {
            return false
        }

    },

    /**
     * Gera uma data de expiração para um token, adicionando um número especificado de minutos à data atual. O valor padrão é 60 minutos.
     */
    getExpiresAt(minutes: number = 60): Date {
        const now = new Date()
        const expiresAt = new Date(now.getTime() + (minutes * 60 * 1000))
        return expiresAt
    },

    /**
     * função para extrair e retornar o token do header
     * Verificar se o token está presente no header Authorization e se segue o formato
     */
    verificaHeaderToken(
        req: Request
    ): string {

        const authHeader = req.headers.authorization

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new apiError(MESSAGES.ERROR.MISSING_TOKEN, 401)
        }
        const token = (authHeader?.split(' ')[1]).trim()
        if (!this.validateToken(token)) {
            throw new apiError(MESSAGES.ERROR.MISSING_TOKEN, 401)
        }

        return token
    },

    verificaParamToken(
        req: Request
    ): string {

        const token = req.params?.token
        if (!this.validateToken(token as string)) {
            throw new apiError(MESSAGES.ERROR.MISSING_TOKEN, 401)
        }
        return token as string

    },


    /**
     * Função para lidar com erros durante a validação do token.
     */
    handleTokenError(
        error: apiError,
        res: Response
    ) {
        ResponseHandler.error(res, error.errorText, error.code, error)
    }
}