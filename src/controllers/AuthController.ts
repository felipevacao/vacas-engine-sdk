import { UsersController } from "@dynamic-modules/controllers/users";
import { UsersEntity } from "@dynamic-modules/entities/users";
import { Model, OutputData, QueryFields, UpdateData } from "types/entity";
import { SessionController } from "./SessionController";
import { hashUtils } from "@utils/hash";
import { HashResult } from "types/hash";

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
	): Promise<HashResult> {

		return await hashUtils.generateHash(password);

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
	 * Verifica a senha fornecida para o email fornecido, comparando-a com o hash armazenado.
	 * Se a senha for válida, mas o pepper estiver desatualizado, atualiza o hash da senha com o novo pepper.
	 * O método comparePassword é chamado para comparar a senha fornecida com o hash armazenado, e se a comparação falhar, ele tenta comparar com versões anteriores do pepper.
	 * Se a comparação for bem-sucedida, ele verifica se o pepper usado na comparação é diferente do pepper atual do usuário. 
	 * Se for diferente, ele chama o método updatePassword para atualizar o hash da senha do usuário com o novo pepper.
	 */
	private async verifyUserPassword(
		email: string, 
		password: string
	): Promise<OutputData<UsersEntity> | null> {

		const user = await this.getEntityByEmail(email);
		if (!user) {
			return null
		}

		const [match, pepper] = await this.comparePassword(password, user?.password, parseInt(user.pepper));

		if (!match) {
			return null
		}
		
		if (user.pepper !== pepper.toString() || hashUtils.checkUpdatePepper(parseInt(user.pepper))) {
			this.updatePassword(user, password);
		}
		return user
	}
	
	/** 
	 * Compara a senha fornecida com o hash armazenado.
	 */
	private async comparePassword(
		password: string, 
		passwordHash: string = '123',
		pepper?: number
	): Promise<[ match: boolean, pepper: number ]> {

		const [ match, pepperVer ] = await hashUtils.compareAsync(password, passwordHash, pepper);
		await new Promise(resolve => setTimeout(resolve, 100));
		return [ match, pepperVer ];

	}

	/**
	 * Valida a senha fornecida comparando-a com o hash armazenado para o usuário.
	 */
	public async validatePassword(
		user: OutputData<UsersEntity>,
		password: string
	): Promise<[ boolean, number ]> {
		return await this.comparePassword(password, user.password, parseInt(user?.pepper));
	}

	/**
	 * Atualiza a senha do usuário fornecendo uma nova senha, gerando um hash e atualizando o registro do usuário no banco de dados.
	 */
	public async updatePassword(
		user: OutputData<UsersEntity>, 
		newPassword: string
	): Promise<void> {

		const { passwordHash, pepper } = await this.generateHash(newPassword);
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
				await this.updateEntity(user.id, { password: passwordHash, pepper: pepper } as UpdateData<UsersEntity>, options);
			} catch (error) {
				let errorMessage = 'Error updating password';
				if(error instanceof Error) {
					errorMessage = error.message
				}
				throw new Error(errorMessage);
			}
		}

	}

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

	public async logout(
		sessionId: string | number
	): Promise<void> {

		await this.session.deleteSession(sessionId);
			
	}

}