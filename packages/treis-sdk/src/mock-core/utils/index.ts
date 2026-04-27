import { ErrorContext } from "../types";

export class apiError extends Error {
	constructor(
		public message: string,
		public statusCode: number = 500,
		public context?: ErrorContext
	) {
		super(message);
	}
}
