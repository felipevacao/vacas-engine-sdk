// Gerado automáticamente
import { BaseController } from '@controllers/baseController';
import produtosModel from './model';
import { produtosEntity } from './entity';
import { QueryFilter } from '@app-types/entity';

export class produtosController extends BaseController<produtosEntity> {
  constructor() {
    super(produtosModel);
  }

  // Filtro padrão do findAll e find - inserido na pesquisa caso não exista outro filtro ou where
  public getDefaultFilters(): QueryFilter[] {
    return []
  }
}
