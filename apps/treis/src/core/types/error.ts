export type errorDetails = string[]

export type ErrorContext = {
	entity?: string,
	id?: number | string,
	ids?: (number | string)[],
	details?: errorDetails,

}