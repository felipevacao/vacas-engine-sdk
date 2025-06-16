import crypto from 'crypto';

export const cryptoUtils = {
    /**
     * Generates a random token.
     * @returns A random token as a hexadecimal string.
     */
    generateToken(): string {
        return crypto.randomBytes(32).toString('hex');
    },
    /**
     * Hashes a token using SHA-256.
     * @param token The token to hash.
     * @returns The hashed token as a hexadecimal string.
     */
    hashToken(token: string): string {
        return crypto.createHash('sha256').update(token).digest('hex');
    },
    /**
     * Verifies a token against a stored hash.
     * @param token The token to verify.
     * @param hash The stored hash to compare against.
     * @returns True if the token matches the hash, false otherwise.
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
     * Generates an expiration date for a token.
     * @returns A Date object representing the expiration time (1 hour from now).
     */
    getExpiresAt(minutes: number = 60): Date {
        const now = new Date();
        const expiresAt = new Date(now.getTime() + minutes * 60 * 1000);
        return expiresAt;
    }
}