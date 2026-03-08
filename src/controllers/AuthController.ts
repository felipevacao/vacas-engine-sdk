import { UsersController } from "@dynamic-modules/controllers/users";
import { UsersEntity } from "@dynamic-modules/entities/users";
import { Model, OutputData, QueryFields, UpdateData } from "types/entity";
import { SessionController } from "./SessionController";
import { hashUtils } from "@utils/hash";

export class AuthController extends UsersController {

	private session: SessionController

	constructor() {
			super();
			this.session = new SessionController()
	}

	/**
	 * Gera um hash para a senha fornecida.
	 */
	public async generateHash(
		password: string
	): Promise<string> {

		return hashUtils.generateHash(password);

	}

	/**
	 * Busca um usuário ativo pelo email fornecido.
	 */
	private async getEntityByEmail(
		email: string
	): Promise<OutputData<UsersEntity> | null> {

		const options = {
			where: { "email": email },
			filters: [{
				field: "status",
				operator: "=",
				value: "active",
			}]
		} as QueryFields<UsersEntity>

		const [userData] = await this.findByEntity(options);
		if (!userData) {
			return null;
		}
		return userData;
	}

	/**
	 * Verifica as credenciais do usuário comparando o email e a senha fornecidos com os dados armazenados.
	 */
	private async verifyUserPassword(
		email: string, 
		password: string
	): Promise<OutputData<UsersEntity> | null> {

		const user = await this.getEntityByEmail(email);
		if(user && await this.comparePassword(password, user?.password)){
			return user
		}
		return null;
	}
	
	/** 
	 * Compara a senha fornecida com o hash armazenado.
	 */
	private async comparePassword(
		password: string, 
		passwordHash: string = '123'
	): Promise<boolean> {

		const match = await hashUtils.compareAsync(password, passwordHash);
		await new Promise(resolve => setTimeout(resolve, 100));
		return match

	}

	/**
	 * Valida a senha fornecida comparando-a com o hash armazenado para o usuário.
	 */
	public async validatePassword(
		user: OutputData<UsersEntity>,
		password: string
	): Promise<boolean> {
		return await this.comparePassword(password, user.password);
	}

	/**
	 * Atualiza a senha do usuário fornecendo uma nova senha, gerando um hash e atualizando o registro do usuário no banco de dados.
	 */
	public async updatePassword(
		user: OutputData<UsersEntity>, 
		newPassword: string
	): Promise<void> {

		const passwordHash = await this.generateHash(newPassword);
		if(user.id){
			const options = {
				fields: ['login' as (keyof Model<UsersEntity>)],
				filters: [{
					field: "status",
					operator: "=",
					value: "active",
				}]
			} as QueryFields<UsersEntity>
			try {
				await this.updateEntity(user.id, { password: passwordHash } as UpdateData<UsersEntity>, options);
			} catch (error) {
				let errorMessage = 'Error updating password';
				if(error instanceof Error) {
					errorMessage = error.message
				}
				throw new Error(errorMessage);
			}
		}

	}
	/** * Logs in a user by verifying their credentials and creating a session.
	 * @param login The user's login or email.
	 * @param password The user's password.
	 * @param ipAdress The IP address of the user.
	 * @returns An object containing the session token if successful, otherwise false.
	 */
	public async login(
		login: string, 
		password: string, 
		ipAdress: string
	): Promise<{ token: string, expiresAt: Date } | boolean> {

			const user = await this.verifyUserPassword(login, password);
			if (!user) {
					return false;
			}
			const session = await this.session.createSession(user, ipAdress);
			return session;
	}
	/**
	 * Logs out a user by deleting their session.
	 * @param sessionId The ID of the session to delete.
	 * @returns A promise that resolves when the session is deleted.
	 */
	public async logout(
		sessionId: string | number
	): Promise<void> {

			await this.session.deleteSession(sessionId);
			
	}

}