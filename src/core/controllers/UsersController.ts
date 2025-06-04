import { BaseController } from '@controllers/baseController';
import UsersModel from '@core/models/users';
import { UsersEntity } from '@core/entities/users';
import { CreateData, InputRequest, Model, OutputData, QueryFields, UpdateData } from 'types/entity';

import { hash, compare, genSalt } from 'bcrypt';

const SALT_ROUNDS = 12;

export class UsersController extends BaseController<UsersEntity> {
  constructor() {
      super(UsersModel);
  }
  
  public override async generateBodyCreate(input: InputRequest<unknown>): Promise<CreateData<UsersEntity> | null> {
      const body = input.body as CreateData<UsersEntity>;
      
      const options = {
        where: { "email": body.email },
        fields: this.getAvailableFields()
      } as QueryFields<UsersEntity>

      const verifyMail = await this.findByEntity(options)
      if(verifyMail && verifyMail.length > 0) {
        throw new Error('E-mail already exists')
      }
      
      options.where = { "login": body.login }

      const verifyLogin = await this.findByEntity(options)
      if(verifyLogin && verifyLogin.length > 0) {
        throw new Error('Login already exists')
      }

      return body;
  }

  private async generateHash(password: string): Promise<string> {
    const salt = await genSalt(SALT_ROUNDS);
    const passwordHash = await hash(password, salt);
    return passwordHash;
  }

  private async getEntityByEmail(email: string): Promise<OutputData<UsersEntity> | null> {
    const options = {
        where: { "email": email },
        // fields: this.getAvailableFields()
      } as QueryFields<UsersEntity>

    const [userData] = await this.findByEntity(options);
    if (!userData) {
      return null;
    }
    return userData;
  }

  public async verifyUserPassword(email: string, password: string): Promise<boolean> {
    const user = await this.getEntityByEmail(email);
    if (!user) {
      return false;
    }
    console.log(user);
    return await this.comparePassword(password, user.password);
  }

  private async comparePassword(password: string, passwordHash: string): Promise<boolean> {
    const match = compare(password, passwordHash);
    await new Promise(resolve => setTimeout(resolve, 500));
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
}
