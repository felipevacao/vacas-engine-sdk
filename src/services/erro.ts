import { ErrorContext } from "types/entity"

export class ErrorService {

	private errorContext: ErrorContext = {}

	setErrorMetadata(metadata: Partial<ErrorContext>) {
        this.errorContext = { ...this.errorContext, ...metadata }
	}
	
	getErrorContext() {
		return this.errorContext
	}
}