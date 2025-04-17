import { BaseController } from '../controllers/baseController';
import UsersModel from '../models/users';
import { UsersEntity } from '../types/entities/users';
import { CreateData, QueryFields } from '../types/entity';
import { Request } from 'express';

export class UsersController extends BaseController<UsersEntity> {
  constructor() {
      super(UsersModel);
  }
  
  protected override async generateBodyCreate(req: Request): Promise<CreateData<UsersEntity>> {
      const body = await super.generateBodyCreate(req);
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
