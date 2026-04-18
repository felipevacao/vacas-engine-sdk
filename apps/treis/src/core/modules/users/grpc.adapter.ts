import { UserService } from './service';
import { UsersController } from './controller';
import { UsersEntity } from './entity';
import { BaseGrpcAdapter } from '@adapters';

class UsersGrpcAdapter extends BaseGrpcAdapter<UsersEntity, UsersController> {
  constructor() {
    const controller = new UsersController();
    const service = new UserService(0, controller);
    super(service);
  }
}

const adapter = new UsersGrpcAdapter();

export default {
  Create: adapter.create.bind(adapter),
  Get: adapter.get.bind(adapter),
  Update: adapter.update.bind(adapter),
  Delete: adapter.delete.bind(adapter),
  List: adapter.list.bind(adapter),
  Metadata: adapter.metadata.bind(adapter),
};
