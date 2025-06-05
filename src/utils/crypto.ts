import crypto from 'crypto';

export const cryptoUtils = {
  
    generateToken(): string {
        return crypto.randomBytes(32).toString('hex');
    },

    hashToken(token: string): string {
        return crypto.createHash('sha256').update(token).digest('hex');
    },

    verifyToken(token: string, hash: string): boolean {
        const newHash = this.hashToken(token);
        return crypto.timingSafeEqual(
        Buffer.from(newHash, 'hex'),
        Buffer.from(hash, 'hex')
        );
    },

    getExpiresAt(): Date {
        const now = new Date();
        const expiresAt = new Date(now.getTime() + 1 * 60 * 60 * 1000); // 1 hora
        return expiresAt;
    }
}