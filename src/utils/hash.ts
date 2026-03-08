import env from "@lib/env"
import bcrypt from "bcrypt"
import { promisify } from "util";

const compareAsync = promisify(bcrypt.compare);

export const hashUtils = {

	/**
	 * Gera um hash de senha usando bcrypt.
	 */
	generateHash(password: string): string {
		const pepperedPassword = password + env.PASS_PEPPER;
		const salt = bcrypt.genSaltSync(env.SALT_ROUNDS || 10);
		const passwordHash = bcrypt.hashSync(pepperedPassword, salt);
		return passwordHash;
	},

	/**
	 * Compara uma senha em texto plano com um hash de senha usando bcrypt.
	 * Retorna uma Promise que resolve para true se as senhas corresponderem, ou false caso contrário.
	 * O método compareAsync é uma versão assíncrona do bcrypt.compare, que é convertida para retornar uma Promise usando util.promisify.
	 */
	async compareAsync(password: string, passwordHash: string): Promise<boolean> {
		const pepperedPassword = password + env.PASS_PEPPER;
		return await compareAsync(pepperedPassword, passwordHash);
	}

}