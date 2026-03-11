import env from "@lib/env"
import bcrypt from "bcrypt"
import { promisify } from "util";
import { PepperConfig } from "./pepper";

const compareAsync = promisify(bcrypt.compare);
const pepperConfig = new PepperConfig();

export const hashUtils = {

	/**
	 * Gera um hash de senha usando bcrypt.
	 */
	generateHash(password: string): [ passwordHash: string, pepper: string ] {
		const pepper = pepperConfig.getCurrentPepper();
		const pepperVersion = pepperConfig.getCurrentVersion();
		const pepperedPassword = password + pepper;
		const salt = bcrypt.genSaltSync(env.SALT_ROUNDS || 10);
		const passwordHash = bcrypt.hashSync(pepperedPassword, salt);
		return [passwordHash, pepperVersion.toString()];
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
	): Promise<[ boolean, pepper: number ]> {
		let pepperVersion = pepper || pepperConfig.getCurrentVersion();
		const currentPepper = pepperConfig.getPepperByVersion(pepperVersion.toString());
		const pepperedPassword = password + currentPepper;
		let match = await compareAsync(pepperedPassword, passwordHash);
		if (!match) {
			[ match, pepperVersion ] = await this.compareAsync(password, passwordHash, pepperVersion - 1);
		}
		return [ match, pepperVersion ];

	},

	checkUpdatePepper(pepper: number): boolean {
		const pepperVersion = pepperConfig.getCurrentVersion();
		return pepperVersion !== pepper;
	}

}