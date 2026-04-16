// Gerado automáticamente
import { MESSAGES } from '@constants/messages';
import { produtosEntity } from './entity';
import * as repository from '@services/repository';
import { apiError } from '@utils/error';
import { Model, Relation } from '@app-types/entity';

const relations: Record<string, Relation> = {  };

const produtosModel: Model<produtosEntity> = {
  table: 'produtos',
  create: repository.create<produtosEntity>('produtos'),
  findAll: repository.read<produtosEntity>('produtos').findAll,
  findAllPaginated: repository.read<produtosEntity>('produtos').findAllPaginated,
  findById: repository.read<produtosEntity>('produtos').findById,
  findBy: repository.read<produtosEntity>('produtos').findBy,
  findByPaginated: repository.read<produtosEntity>('produtos').findByPaginated,
  update: repository.update<produtosEntity>('produtos'),
  delete: repository.deleteById('produtos'),
  forceDelete: repository.forceDelete('produtos'),
  count: repository.read<produtosEntity>('produtos').count,
  selectAbleFields: ['produto'],
  defaultFields: ['id'],
  excludedFields: [],
  relations,
  metadata: async () => {
      const result = await repository.metadata('produtos')();
      if (!result) throw new apiError(MESSAGES.DATABASE.ENTITY.METADATA_NOT_FOUND);
      return result;
    },
};

export default produtosModel;
