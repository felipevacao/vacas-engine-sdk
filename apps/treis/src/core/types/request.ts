import { BaseEntity, BaseView } from "@interfaces";
// Layout de Query
export type QueryFields<T extends BaseEntity | BaseView> = {
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
	// filter is used for specific conditions like 'greater than', 'less than', etc.
	// Example: filter: { field: 'age', sign: '>', value: '18' }
	filters?: QueryFilter[];
	paginated?: boolean;
	includes?: string[];
}

export type QueryFilter = {
	field: string
	operator: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'LIKE' | 'IN' | 'BETWEEN'
	value: string | number | boolean | Date | (string | number)[]
}


export type LoginRequest = {
	email: string;
	password: string;
};

export type PasswordResetRequest = {
	email?: string;
	newPassword?: string;
};

export type PasswordChangeRequest = {
	currentPassword: string;
	newPassword: string;
};