import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BaseServices } from './baseServices';
import { BaseController } from '@controllers';
import { BaseEntity } from '@interfaces';
import * as utils from '@utils';

// Entidade de teste tipada
interface TestEntity extends BaseEntity {
  id: number;
  name: string;
}

// Mock do BaseController tipado corretamente
class MockController extends BaseController<TestEntity> {
  constructor() { 
    super({ table: 'users' } as any); 
  }
  getModelTable = vi.fn().mockReturnValue('users');
  createEntity = vi.fn();
  findByIdEntity = vi.fn();
  updateEntity = vi.fn();
  deleteEntity = vi.fn();
  createBulkEntity = vi.fn().mockResolvedValue([{ id: 1, name: 'Test1' }]);
  updateBulkEntity = vi.fn().mockResolvedValue([{ id: 1, name: 'Updated' }]);
  deleteBulkEntity = vi.fn().mockResolvedValue(true);
}

vi.mock('@utils', async (importOriginal) => {
    const actual = await importOriginal<typeof utils>();
    return {
        ...actual,
        ErrorHandler: {
            handleDatabaseError: vi.fn((e) => { throw e; })
        },
        validateSchemaBulk: vi.fn().mockReturnValue(true)
    }
});

describe('BaseServices - Integração Bulk', () => {
  let service: BaseServices<TestEntity, MockController>;
  let controller: MockController;

  beforeEach(() => {
    controller = new MockController();
    service = new BaseServices<TestEntity, MockController>(controller);
    service.getMetadata = vi.fn().mockResolvedValue({ fields: [{ name: 'name' }] });
    vi.clearAllMocks();
  });

  it('should successfully execute createMany', async () => {
    const data: TestEntity[] = [{ id: 1, name: 'Test1' }];
    const result = await service.createMany(data, {});
    
    expect(controller.createBulkEntity).toHaveBeenCalledWith(data, {});
    expect(result).toEqual([{ id: 1, name: 'Test1' }]);
  });

  it('should successfully execute updateMany', async () => {
    const ids = [1];
    const data: TestEntity = { id: 1, name: 'Updated' };
    const result = await service.updateMany(ids, data, {});
    
    expect(controller.updateBulkEntity).toHaveBeenCalledWith(ids, data, {});
    expect(result).toEqual([{ id: 1, name: 'Updated' }]);
  });

  it('should successfully execute deleteMany', async () => {
    const ids = [1];
    const result = await service.deleteMany(ids);
    
    expect(controller.deleteBulkEntity).toHaveBeenCalledWith(ids);
    expect(result).toBe(true);
  });
});
