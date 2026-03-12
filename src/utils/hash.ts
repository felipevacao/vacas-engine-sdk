import env from "@lib/env"
import bcrypt from "bcrypt"
import crypto from 'crypto'
import { promisify } from "util";
import { PepperConfig } from "./pepper";
import { HashResult } from "types/hash";

const compareAsync = promisify(bcrypt.compare);
const pepperConfig = new PepperConfig();


export const hashUtils = {

	preparePassword(password: string): string {

		const hmac = crypto.createHmac('sha256', pepperConfig.getCurrentPepper());
        hmac.update(password);
        hmac.update(pepperConfig.pepperSeparator);
		hmac.update(pepperConfig.getCurrentVersion().toString());
		
		return hmac.digest('hex')

	},

	/**
	 * Gera um hash de senha usando bcrypt.
	 */
	async generateHash(password: string): Promise<HashResult> {
		const pepperVersion = pepperConfig.getCurrentVersion();
		const pepperedPassword = this.preparePassword(password)
		const salt = await bcrypt.genSalt(env.SALT_ROUNDS || 10);
		const passwordHash = await bcrypt.hash(pepperedPassword, salt);
		return {
			passwordHash,
			pepper: pepperVersion.toString()
		};
	},

	/**
	 * Compara uma senha em texto plano com um hash de senha usando bcrypt.
	 * Retorna uma Promise que resolve para true se as senhas corresponderem, ou false caso contrário.
	 * O método compareAsync é uma versão assíncrona do bcrypt.compare, que é convertida para retornar uma Promise usando util.promisify.
	 */
	async compareAsync(
		password: string,
		passwordHash: string,
		pepper?: number
	): Promise<[boolean, pepper: number]> {
		
		let pepperVersion = pepper || pepperConfig.getCurrentVersion();
		const currentPepper = pepperConfig.getPepperByVersion(pepperVersion.toString());
		const pepperedPassword = password + currentPepper;
		let match = await compareAsync(pepperedPassword, passwordHash);
		if (!match) {
			[ match, pepperVersion ] = await this.compareAsync(password, passwordHash, pepperVersion - 1);
		}
		return [ match, pepperVersion ];

	},

	/**
	 * Verifica se há atualização no Pepper
	 */
	checkUpdatePepper(pepper: number): boolean {
		const pepperVersion = pepperConfig.getCurrentVersion();
		return pepperVersion !== pepper;
	}

}