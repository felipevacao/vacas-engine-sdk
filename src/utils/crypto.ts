import crypto from 'crypto'
import env from '@lib/env'

interface TokenConfig {
    tokenBytes?: number      // Padrão: 32
    hashAlgorithm?: string   // Padrão: 'sha256'
    pepper?: string          // Opcional
}

class TokenManager {

    public readonly tokenBytes: number
    public readonly hashAlgorithm: string
    public readonly pepper: string

    constructor (config: TokenConfig = {}) {
        this.tokenBytes = config.tokenBytes || parseInt(env.TOKEN_BYTES)
        this.hashAlgorithm = config.hashAlgorithm || env.TOKEN_ALGOR
        this.pepper = config.pepper || env.TOKEN_PEPPER
    }

}

export const cryptoUtils = {
    /**
     * Gera um token aleatório usando o módulo crypto do Node.js.
     */
    generateToken(): string {
        const manager = new TokenManager()
        return crypto.randomBytes(manager.tokenBytes).toString('hex')
    },
    /**
    * Gera um hash de um token usando o algoritmo SHA-256. O hash é retornado como uma string hexadecimal.
     */
    hashToken(token: string): string {
        const manager = new TokenManager()
        const pepperedHash = token + manager.pepper
        return crypto.createHash(manager.hashAlgorithm).update(pepperedHash).digest('hex')
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

        const manager = new TokenManager()

        // Valida formato do hash armazenado (64 caracteres hex para SHA-256)
        const hexRegex = new RegExp(`^[a-f0-9]{${manager.hashAlgorithm === 'sha256' ? 64 : 128}}$`, 'i')
        if (!hexRegex.test(hash)) {
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
    }
}