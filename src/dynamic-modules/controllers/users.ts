import { BaseController } from '@controllers/baseController';
import UsersModel from '@dynamic-modules/models/users';
import { UsersEntity } from '@dynamic-modules/entities/users';
import { CreateData, InputRequest, QueryFields, UpdateData } from 'types/entity';

export class UsersController extends BaseController<UsersEntity> {
  constructor() {
      super(UsersModel);
  }
  
  /**
   * Generates the body for creating a new user entity.
   * Validates that the email and login are unique.
   * @param input The input request containing the user data.
   * @returns The create data for the user or throws an error if validation fails.
   */
  public override async generateBodyCreate(
    input: InputRequest<unknown>
  ): Promise<CreateData<UsersEntity> | null> {

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

  /**
   * Generates the body for updating an existing user entity.
   * @param input The input request containing the user data.
   * @returns The update data for the user or null if not extended.
   */
  public override async generateBodyUpdate(
      input: InputRequest<unknown>
  ): Promise<UpdateData<UsersEntity> | null> {
      console.log(input)
      const body = input.body as Partial<UpdateData<UsersEntity>>;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...rest } = body;
      return rest as UpdateData<UsersEntity>;
  }

}
