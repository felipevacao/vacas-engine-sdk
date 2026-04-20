import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BaseServices } from './baseServices';
import { BaseController } from '@controllers';
import { BaseEntity, IVirtualFieldDefinition } from '@interfaces';

interface TestEntity extends BaseEntity {
  id: number;
  name: string;
}

class MockController extends BaseController<TestEntity> {
  constructor() { 
    super({ table: 'test', defaultFields: ['id', 'name'], selectAbleFields: ['id', 'name'], excludedFields: [] } as any); 
  }
  findByIdEntity = vi.fn();
  findByEntity = vi.fn();
  createEntity = vi.fn();
  updateEntity = vi.fn();
  getDefaultFilters = vi.fn().mockReturnValue([]);
  getModelTable = vi.fn().mockReturnValue('test');
}

describe('BaseServices - Virtual Fields', () => {
  let service: BaseServices<TestEntity, MockController>;
  let controller: MockController;

  const virtualFields: IVirtualFieldDefinition<TestEntity> = {
    initials: (row) => row.name.charAt(0).toUpperCase()
  };

  beforeEach(() => {
    controller = new MockController();
    service = new BaseServices<TestEntity, MockController>(controller, virtualFields);
    vi.clearAllMocks();
  });

  it('should apply virtual fields to a single record in findByIdEntity', async () => {
    const mockData = { id: 1, name: 'felipe' };
    controller.findByIdEntity.mockResolvedValue(mockData);

    const result = await service.findByIdEntity(1);
    
    expect(result).toHaveProperty('initials', 'F');
    expect(result.name).toBe('felipe');
  });

  it('should apply virtual fields to an array in findEntityBy', async () => {
    const mockData = [
      { id: 1, name: 'alice' },
      { id: 2, name: 'bob' }
    ];
    controller.findByEntity.mockResolvedValue(mockData);

    const result = await service.findEntityBy({});
    
    expect(result[0]).toHaveProperty('initials', 'A');
    expect(result[1]).toHaveProperty('initials', 'B');
  });

  it('should apply virtual fields in createEntity', async () => {
    const mockData = { id: 1, name: 'felipe' };
    controller.createEntity.mockResolvedValue(mockData);

    const result = await service.createEntity({ name: 'felipe' } as any);
    
    expect(result).toHaveProperty('initials', 'F');
  });

  it('should apply virtual fields in updateEntity', async () => {
    const mockData = { id: 1, name: 'felipe' };
    controller.updateEntity.mockResolvedValue(mockData);

    const result = await service.updateEntity(1, { name: 'felipe' } as any);
    
    expect(result).toHaveProperty('initials', 'F');
  });

  it('should apply virtual fields to large lists (performance check)', async () => {
    const listSize = 1000;
    const mockData = Array.from({ length: listSize }, (_, i) => ({
      id: i,
      name: `User ${i}`
    }));
    controller.findByEntity.mockResolvedValue(mockData);

    const startTime = performance.now();
    const result = await service.findEntityBy({});
    const endTime = performance.now();

    expect(result).toHaveLength(listSize);
    expect(result[listSize - 1]).toHaveProperty('initials', 'U');
    console.log(`Processing ${listSize} records took ${endTime - startTime}ms`);
  });
});
