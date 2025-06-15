import env from "@lib/env"
import bcrypt from "bcrypt"
import { promisify } from "util";

const compareAsync = promisify(bcrypt.compare);

export const hashUtils = {

  /**
   * Generates a hash for the given password.
   * @param password The password to hash.
   * @returns The hashed password.
   */
  generateHash(password: string): string {
    const salt = bcrypt.genSaltSync(env.SALT_ROUNDS || 10);
    const passwordHash = bcrypt.hashSync(password, salt);
    return passwordHash;
  },

  async compareAsync(password: string, passwordHash: string): Promise<boolean> {
    return await compareAsync(password, passwordHash);
  }

}