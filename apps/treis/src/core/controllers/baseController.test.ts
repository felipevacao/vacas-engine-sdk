import { describe, it, expect, vi } from 'vitest';
import { BaseController } from './baseController';
import { BaseEntity } from '@interfaces';

// Mock de uma entidade para testes
interface TestEntity extends BaseEntity { name: string }

class TestController extends BaseController<TestEntity> {}

describe('BaseController', () => {
  const mockModel = {
    table: 'test_table',
    create: vi.fn(),
    findAll: vi.fn(),
    findAllPaginated: vi.fn(),
    findById: vi.fn(),
    findBy: vi.fn(),
    findByPaginated: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    forceDelete: vi.fn(),
    count: vi.fn(),
    createBulk: vi.fn(),
    updateBulk: vi.fn(),
    deleteBulk: vi.fn(),
    selectAbleFields: ['id', 'name'],
    defaultFields: ['id', 'name'],
    excludedFields: [],
    metadata: vi.fn(),
  } as any;

  const controller = new TestController(mockModel);

  it('should get model table', () => {
    expect(controller.getModelTable()).toBe('test_table');
  });

  it('should call model.createEntity', async () => {
    await controller.createEntity({ name: 'test' }, {});
    expect(mockModel.create).toHaveBeenCalled();
  });

  it('should call model.findAll', async () => {
    await controller.findAllEntity({});
    expect(mockModel.findAll).toHaveBeenCalled();
  });

  it('should call model.findById', async () => {
    await controller.findByIdEntity(1, {});
    expect(mockModel.findById).toHaveBeenCalledWith(1, {});
  });

  it('should call model.update', async () => {
    await controller.updateEntity(1, { name: 'test' }, {});
    expect(mockModel.update).toHaveBeenCalled();
  });

  it('should call model.delete', async () => {
    await controller.deleteEntity(1);
    expect(mockModel.delete).toHaveBeenCalledWith(1);
  });

  it('should call model.createBulk', async () => {
    await controller.createBulkEntity([{ name: 'test' }], {});
    expect(mockModel.createBulk).toHaveBeenCalled();
  });

  it('should call model.updateBulk', async () => {
    await controller.updateBulkEntity([1], { name: 'test' }, {});
    expect(mockModel.updateBulk).toHaveBeenCalled();
  });

  it('should call model.deleteBulk', async () => {
    await controller.deleteBulkEntity([1]);
    expect(mockModel.deleteBulk).toHaveBeenCalledWith([1]);
  });
});
