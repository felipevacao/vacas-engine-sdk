import env from "@lib/env"
import bcrypt from "bcrypt"
import crypto from 'crypto'
import { promisify } from "util"
import { PepperConfig } from "./pepper"
import { HashResult } from "types/hash"

const compareAsync = promisify(bcrypt.compare)
const pepperConfig = new PepperConfig()


export const hashUtils = {

	/**
	 * Prepara a senha para a geração de Hash
	 */
	preparePassword(password: string, pepperVersion: string): string {

		const hmac = crypto.createHmac('sha256', pepperConfig.getPepperByVersion(pepperVersion))
        hmac.update(password)
        hmac.update(pepperConfig.pepperSeparator)
		hmac.update(pepperVersion)
		
		return hmac.digest('hex')
	},

	/**
	 * Gera um hash de senha usando bcrypt.
	 */
	async generateHash(
		password: string,
		pepperVersion: string = pepperConfig.getCurrentVersion().toString()
	): Promise<HashResult> {

		const pepperedPassword = this.preparePassword(password, pepperVersion)
		const salt = await bcrypt.genSalt(env.SALT_ROUNDS || 10)
		const passwordHash = await bcrypt.hash(pepperedPassword, salt)
		return {
			passwordHash,
			pepper: pepperVersion
		}
	},

	/**
	 * Compara uma senha em texto plano com um hash de senha usando bcrypt.
	 * Retorna uma Promise que resolve para true se as senhas corresponderem, ou false caso contrário.
	 * O método compareAsync é uma versão assíncrona do bcrypt.compare, que é convertida para retornar uma Promise usando util.promisify.
	 */
	async compareAsync(
		password: string,
		passwordHash: string,
		pepper?: number // Recebe o pepper gravado no registro do usuário
	): Promise<[boolean, pepper: number]> {
		if (pepper == 0) {
			return [ false, pepperConfig.getCurrentVersion() ]
		}
		const pepperVersion = pepper || pepperConfig.getCurrentVersion()
		const pepperedPassword = this.preparePassword(password, pepperVersion.toString())
		const match = await compareAsync(pepperedPassword, passwordHash)
		return [ match, pepperVersion ]

	},

	/**
	 * Verifica se há atualização no Pepper
	 */
	checkUpdatePepper(pepper: number): boolean {
		const pepperVersion = pepperConfig.getCurrentVersion()
		return pepperVersion !== pepper
	}

}