import { LoginRequest } from "@app-types"
import { BaseEntity } from "./entity"

export * from "./adapter"
export * from "./controller"
export * from "./entity"
export * from "./model"
export * from "./services"
export * from "./metadata"
export * from "./response"
export * from "./hash"
export * from "./express"
export * from "./grpc"

export interface InputRequest<T> {
	originalUrl?: string
	body?: object | LoginRequest,
	params?: object,
	query: {
		fields?: string
		where?: Partial<T>
		filter?: string | [] | undefined
		orderBy?: string
		order?: 'asc' | 'desc'
		limit?: number
		offset?: number
		page?: number
		pageSize?: number
		links?: string
		paginated?: string
		include?: string
	}
}

export interface Metadata {
	table: string
	fields: {
		name: string
		type: string
		maxLength: number
		formType?: string
		label?: string
		required?: boolean
	}[]

	// relationships?: unknown[] // Placeholder for future relationships
	// constraints?: unknown[] // Placeholder for future constraints
}

export interface PaginatedResult<T extends BaseEntity> {
	data: T[]
	pagination: {
		page: number
		limit: number
		total: number
		totalPages: number
		hasNext: boolean
		hasPrev: boolean
		nextPageUrl?: string | null
		prevPageUrl?: string | null
	}
}