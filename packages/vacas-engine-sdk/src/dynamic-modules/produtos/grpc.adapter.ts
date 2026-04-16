import { produtosService } from './service';
import { produtosController } from './controller';
import { produtosEntity } from './entity';
import { BaseGrpcAdapter } from '@adapters/grpc.adapter';

class produtosGrpcAdapter extends BaseGrpcAdapter<produtosEntity, produtosController> {
  constructor() {
    const controller = new produtosController();
    const service = new produtosService(controller);
    super(service);
  }
}

const adapter = new produtosGrpcAdapter();

export default {
  Create: adapter.create.bind(adapter),
  Get: adapter.get.bind(adapter),
  Update: adapter.update.bind(adapter),
  Delete: adapter.delete.bind(adapter),
  List: adapter.list.bind(adapter),
  Metadata: adapter.metadata.bind(adapter),
};
