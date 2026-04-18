// Gerado automáticamente
import { BaseController } from '@controllers';
import UserSessionsModel from './model';
import { UserSessionsEntity } from './entity';
import { QueryFilter, SessionType } from '@app-types';

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
