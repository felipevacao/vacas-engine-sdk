import { ErrorContext } from "@app-types/entity"
import env from "@core/libs/env"

export class ErrorService {

	private errorContext: ErrorContext = {}

	setErrorMetadata(metadata: Partial<ErrorContext>) {
		if (!env.ENABLE_RETURN_ERRORS) return
		this.errorContext = { ...this.errorContext, ...metadata }
	}

	setErrorMetadataDetails(detail: string) {
		if (!env.ENABLE_RETURN_ERRORS) return
		const detailsContext = this.errorContext.details || []
		detailsContext.push(`${new Date()} ${detail}`)
		this.setErrorMetadata({ details: detailsContext })
	}

	getErrorContext() {
		return this.errorContext
	}
}