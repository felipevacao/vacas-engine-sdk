import env from "@libs/env"

export class PepperConfig {

	pepperVersions: Record<string, string>
	currentVersion: string
	pepperSeparator: string

	constructor() {
		try {
			const rawVersions = env.PEPPER_VERSIONS?.trim();
			this.pepperVersions = rawVersions ? JSON.parse(rawVersions) : { "1": "" };
		} catch (error) {
			console.error("[ERRO] Falha crítica ao parsear PEPPER_VERSIONS. Usando configuração padrão.", error);
			this.pepperVersions = { "1": "" };
		}
		this.currentVersion = env.PEPPER_CURRENT || '1'
		this.pepperSeparator = '\x00'
	}

	getCurrentPepper(): string {
		return this.pepperSeparator + this.pepperVersions[this.currentVersion] || ''
	}

	getPepperByVersion(version: string): string {
		return this.pepperVersions[version] || ''
	}

	getCurrentVersion(): number {
		return parseInt(this.currentVersion)
	}

}