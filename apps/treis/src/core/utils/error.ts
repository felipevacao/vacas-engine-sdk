import { ErrorContext, sMessage } from "@app-types"

export class apiError extends Error {
	name: string
	code: number
	details: ErrorContext
	errorText: sMessage

	constructor(error: sMessage, code: number = 500, details: ErrorContext = {}) {
		super(error.message)
		this.name = error.name
		this.code = code
		this.details = details
		this.errorText = error
	}
}