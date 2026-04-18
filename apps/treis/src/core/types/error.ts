export type errorDetails = string[]

export type ErrorContext = {
	entity?: string,
	id?: number | string,
	details?: errorDetails,

}