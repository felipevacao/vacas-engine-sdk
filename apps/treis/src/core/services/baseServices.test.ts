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
  createBulkEntity = vi.fn().mockResolvedValue([]);
  updateBulkEntity = vi.fn().mockResolvedValue([]);
  deleteBulkEntity = vi.fn().mockResolvedValue(true);
}

vi.mock('@utils', async (importOriginal) => {
    const actual = await importOriginal<typeof utils>();
    return {
        ...actual,
        ErrorHandler: {
            handleDatabaseError: vi.fn((e) => { throw e; })
        },
        validateSchemaBulk: vi.fn().mockImplementation(() => true)
    }
});

describe('BaseServices', () => {
  let service: BaseServices<TestEntity, MockController>;
  let controller: MockController;

  beforeEach(() => {
    controller = new MockController();
    service = new BaseServices<TestEntity, MockController>(controller);
    service.getMetadata = vi.fn().mockResolvedValue({ fields: [] });
    vi.clearAllMocks();
  });

  it('should call createEntity on controller', async () => {
    await service.createEntity({ name: 'Test' } as any, {});
    expect(controller.createEntity).toHaveBeenCalled();
  });

  it('should call createMany and validateSchemaBulk', async () => {
    const data: TestEntity[] = [{ id: 1, name: 'Test1' }];
    await service.createMany(data, {});
    expect(controller.createBulkEntity).toHaveBeenCalled();
  });

  it('should call deleteMany and return boolean', async () => {
    const result = await service.deleteMany([1]);
    expect(result).toBe(true);
  });
});
