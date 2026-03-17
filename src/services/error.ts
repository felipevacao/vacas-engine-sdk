import { ErrorContext } from "types/entity"

export class ErrorService {

	private errorContext: ErrorContext = {}

	setErrorMetadata(metadata: Partial<ErrorContext>) {
		this.errorContext = { ...this.errorContext, ...metadata }
	}

	setErrorMetadataDetails(detail: string) {
		const detailsContext = this.errorContext.details || []
		detailsContext.push(`${new Date()} ${detail}`)
		this.setErrorMetadata({ details: detailsContext })
	}

	getErrorContext() {
		return this.errorContext
	}
}