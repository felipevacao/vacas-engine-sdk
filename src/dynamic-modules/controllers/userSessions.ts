// Gerado automáticamente
import { BaseController } from '@controllers/baseController';
import UserSessionsModel from '@dynamic-modules/models/userSessions';
import { UserSessionsEntity } from '@dynamic-modules/entities/userSessions';

export class UserSessionsController extends BaseController<UserSessionsEntity> {
  constructor() {
    super(UserSessionsModel);
  }
}
