import crypto from 'crypto';

export const cryptoUtils = {
    /**
     * Gera um token aleatório usando o módulo crypto do Node.js.
     */
    generateToken(): string {
        return crypto.randomBytes(32).toString('hex');
    },
    /**
    * Gera um hash de um token usando o algoritmo SHA-256. O hash é retornado como uma string hexadecimal.
     */
    hashToken(token: string): string {
        return crypto.createHash('sha256').update(token).digest('hex');
    },
    /**
     * Verifica se um token corresponde a um hash usando uma comparação segura contra ataques de timing.
     */
    verifyToken(
        token: string,
        hash: string
    ): boolean {

        const newHash = this.hashToken(token);
        return crypto.timingSafeEqual(
            Buffer.from(newHash, 'hex'),
            Buffer.from(hash, 'hex')
        );

    },

    /**
     * Gera uma data de expiração para um token, adicionando um número especificado de minutos à data atual. O valor padrão é 60 minutos.
     */
    getExpiresAt(minutes: number = 60): Date {
        const now = new Date();
        const expiresAt = new Date(now.getTime() + (minutes * 60 * 1000));
        return expiresAt;
    }
}