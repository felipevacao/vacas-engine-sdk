import { BaseEntity } from "../interfaces";
export type CreateData<T extends BaseEntity> = Omit<T, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;
export type UpdateData<T extends BaseEntity> = Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>>;
export type OutputData<T extends BaseEntity> = Omit<T, "createdAt" | 'updatedAt' | 'deletedAt'>;
export type errorDetails = string[]
export type ErrorContext = {
	entity?: string,
	id?: number | string,
	details?: errorDetails
}
export type QueryFields<T extends BaseEntity> = {
	originalUrl?: string;
	links?: boolean,
	fields?: (string | number | symbol)[],
	where?: Partial<T>,
	limit?: number,
	offset?: number,
	orderBy?: string,
	order?: 'asc' | 'desc',
	page?: number,
	pageSize?: number,
	filters?: QueryFilter[];
	paginated?: boolean;
	includes?: string[];
}
export type QueryFilter = {
	field: string
	operator: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'LIKE' | 'IN' | 'BETWEEN'
	value: string | number | boolean | Date | (string | number)[]
}