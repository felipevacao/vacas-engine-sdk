export type UserStatus = 'active' | 'inactive' | 'banned' | 'reset_required'

export type UserRole = 'admin' | 'manager' | 'regular' | 'guest'

export enum SessionType {
	ACTIVE = 'active',
	RESET = 'reset_required'
}

export enum UserStatusType {
	ACTIVE = 'active',
	RESET = 'reset_required',
	BANNED = 'banned',
	INACTIVE = 'inactive'
}

export enum UserRolesType {
	ADMIN = 'admin',
	MANAGER = 'manager',
	REGULAR = 'regular',
	GUEST = 'guest'
}
