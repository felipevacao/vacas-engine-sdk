import { BaseController } from '@controllers/baseController';
import UsersModel from '@core/models/users';
import { UsersEntity } from '@core/entities/users';
import { CreateData, InputRequest, QueryFields } from 'types/entity';

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

  
}
