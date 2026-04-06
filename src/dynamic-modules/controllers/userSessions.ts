// Gerado automáticamente
import { BaseController } from '@controllers/baseController';
import UserSessionsModel from '@dynamic-modules/models/userSessions';
import { UserSessionsEntity } from '@dynamic-modules/entities/userSessions';
import { QueryFilter, SessionType } from '@app-types/entity';

export class UserSessionsController extends BaseController<UserSessionsEntity> {
  constructor() {
    super(UserSessionsModel);
  }

  public override getDefaultFilters(): QueryFilter[] {
    return [
      { field: 'status', operator: '=', value: SessionType.ACTIVE },
      { field: 'is_revoked', operator: '!=', value: true }
    ]
  }
}
