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
          links: false,
          where: {"email": body.email}
        } as QueryFields<UsersEntity>;
      const result = await UsersModel.findBy(options)
      
      if(result && result.length > 0) {
        throw new Error('User already exists')
      }
      return body;
  }
}
