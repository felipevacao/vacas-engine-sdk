import { UsersController } from "@dynamic-modules/controllers/users";

export class UsersService {
	
	constructor(
		private entityController = new UsersController()
	) { }
	

}