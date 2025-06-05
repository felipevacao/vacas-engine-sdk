// Gerado automáticamente
import { BaseController } from '@controllers/baseController';
import User_sessionsModel from '@core/models/user_sessions';
import { User_sessionsEntity } from '@core/entities/user_sessions';

export class User_sessionsController extends BaseController<User_sessionsEntity> {
  constructor() {
      super(User_sessionsModel);
  }
}
