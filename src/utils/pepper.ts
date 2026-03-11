import env from "@lib/env"

export class PepperConfig {

	pepperVersions: Record<string, string>
	currentVersion: string

	constructor() {
		this.pepperVersions = JSON.parse(env.PEPPER_VERSIONS)
		this.currentVersion = env.PEPPER_CURRENT
	}

	getCurrentPepper(): string {
		return this.pepperVersions[this.currentVersion] || ''
	}

	getPepperByVersion(version: string): string {
		return this.pepperVersions[version] || ''
	}

	getCurrentVersion(): number {
		return parseInt(this.currentVersion)
	}

}