import { UserService } from "@dynamic-modules/services/user";

export class UserSessionWorkflow {

	constructor(
		private userService: UserService = new UserService()
	) {

	}
}