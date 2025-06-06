import { UsersController } from "@dynamic-modules/controllers/users";
import { UsersEntity } from "@dynamic-modules/entities/users";
import { hash, genSalt, compare } from 'bcrypt';
import { promisify } from 'util';
import { Model, OutputData, QueryFields, UpdateData } from "types/entity";
import { SessionController } from "./SessionController";

const SALT_ROUNDS = 12;
const compareAsync = promisify(compare);

export class AuthController extends UsersController {
    private session: SessionController
    constructor() {
        super();
        this.session = new SessionController()
    }

    private async generateHash(password: string): Promise<string> {
        const salt = await genSalt(SALT_ROUNDS);
        const passwordHash = await hash(password, salt);
        return passwordHash;
    }

  private async getEntityByEmail(email: string): Promise<OutputData<UsersEntity> | null> {
    const options = {
        where: { "email": email },
      } as QueryFields<UsersEntity>

    const [userData] = await this.findByEntity(options);
    if (!userData) {
      return null;
    }
    return userData;
  }

  private async verifyUserPassword(email: string, password: string): Promise<OutputData<UsersEntity> | null> {
    const user = await this.getEntityByEmail(email);

    if(user && await this.comparePassword(password, user?.password)){
      return user
    }
    return null;
  }

  private async comparePassword(password: string, passwordHash: string = '123'): Promise<boolean> {
    const match = await compareAsync(password, passwordHash);
    
    await new Promise(resolve => setTimeout(resolve, 100));
    return match
  }

  private async updatePassword(user: OutputData<UsersEntity>, newPassword: string): Promise<void> {
    const passwordHash = await this.generateHash(newPassword);
    if(user.id){
      const options = {
        fields: ['login' as (keyof Model<UsersEntity>)],
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

  public async login(login: string, password: string, ipAdress: string): Promise<{ token: string } | boolean> {
      const user = await this.verifyUserPassword(login, password);
      if (!user) {
          return false;
      }
      const session = await this.session.createSession(user, ipAdress);
      return session;
  }

  public async logout(sessionId: string | number): Promise<void> {
      await this.session.deleteSession(sessionId);
  }

}