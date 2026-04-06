import { UserService } from "./service";
import { UserRole } from '@app-types/entity'

export class UsersRolesService extends UserService {

	validateRole(role: UserRole): boolean {
		if (this.getEntity().role === role) {
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