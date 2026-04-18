import { ErrorContext } from "@app-types";

/**
 * SDK ErrorService Skeleton.
 */
export class ErrorService {
    public setErrorMetadata(metadata: Partial<ErrorContext>): void { }
    public setErrorMetadataDetails(details: string): void { }
    public getErrorContext(): ErrorContext { return {} }
}
