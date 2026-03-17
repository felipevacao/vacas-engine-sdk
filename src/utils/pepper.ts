import env from "libs/env"

export class PepperConfig {

	pepperVersions: Record<string, string>
	currentVersion: string
	pepperSeparator: string

	constructor() {
		this.pepperVersions = JSON.parse(env.PEPPER_VERSIONS)
		this.currentVersion = env.PEPPER_CURRENT
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