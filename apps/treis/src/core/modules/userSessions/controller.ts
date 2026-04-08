// Gerado automáticamente
import { BaseController } from '@controllers/baseController';
import UserSessionsModel from '@core-modules/userSessions/model';
import { UserSessionsEntity } from '@core-modules/userSessions/entity';
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
