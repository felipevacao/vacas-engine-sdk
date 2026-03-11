import env from "@lib/env"

export class log {

	static console(mensagem: string) {
		if (env.ENABLE_CONSOLE_LOG) {
			console.log(mensagem)
		}
	}

}