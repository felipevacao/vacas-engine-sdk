import { hashUtils } from "@utils";
import { HashResult } from "@interfaces";

export class AuthService {

	async generateHash(
		password: string
	): Promise<HashResult> {
		return await hashUtils.generateHash(password);
	}

	async comparePassword(
		password: string,
		passwordHash: string = '123',
		pepper?: number
	): Promise<[match: boolean, pepper: number]> {
		const [match, pepperVer] = await hashUtils.compareAsync(password, passwordHash, pepper);
		await new Promise(resolve => setTimeout(resolve, 100));
		return [match, pepperVer];

	}

	verifyUserPepperVersion(
		pepper: number
	): boolean {
		return hashUtils.checkUpdatePepper(pepper)
	}

	getCurrentPepperVersion() {
		return hashUtils.getCurrentPeppeVersion()
	}

}