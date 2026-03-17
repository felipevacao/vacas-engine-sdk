import env from "libs/env"

export class log {

	static console(mensagem: string) {
		if (env.ENABLE_CONSOLE_LOG) {
			console.log(mensagem)
		}
	}

}