import { produtosController } from './produtos/controller';

export interface ModuleDefinition {
  name: string;
  version: string;
  controllers: any[];
  services: any[];
  routes: any[];
  middlewares?: any[];
}

export const ProdutosModule: ModuleDefinition = {
  name: 'produtos',
  version: '1.0.0',
  controllers: [produtosController],
  services: [],
  routes: [],
};
