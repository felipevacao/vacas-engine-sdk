import { UsersService } from "./users";
import { UserRole } from 'types/entity'

export class UsersRolesService extends UsersService {

	validateRole(role: UserRole): boolean {
		if (this.entity && this.entity.role === role) {
			return true
		}
		return false
	}

	isGuest(): boolean {
		return this.validateRole('guest')
	}

	isAdmin(): boolean {
		return this.validateRole('admin')
	}
}