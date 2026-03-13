export class apiError extends Error {
	code: number
	
	constructor(message?: string, name: string = '', code: number = 500) {
		super(message)
		this.name = name
		this.code = code
	}
}