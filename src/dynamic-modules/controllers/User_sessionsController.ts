// Gerado automáticamente
import { BaseController } from '@controllers/baseController';
import User_sessionsModel from '@dynamic-modules/models/user_sessions';
import { User_sessionsEntity } from '@dynamic-modules/entities/user_sessions';

export class User_sessionsController extends BaseController<User_sessionsEntity> {
  constructor() {
      super(User_sessionsModel);
  }
}
