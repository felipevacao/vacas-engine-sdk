import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createBulk } from './createBulk';
import * as utils from '@utils';
import * as services from '@services';

vi.mock('@utils', async (importOriginal) => {
  const actual = await importOriginal<typeof utils>();
  
  // O Knex instanciado é uma função que retorna um objeto encadeável
  const mockKnex = vi.fn().mockReturnValue({
    insert: vi.fn().mockReturnThis(),
    returning: vi.fn().mockResolvedValue([{ id: 1, name: 'Test1' }, { id: 2, name: 'Test2' }]),
  });

  return {
    ...actual,
    db: {
      ...actual.db,
      transaction: vi.fn((cb) => cb(mockKnex)),
    },
    ErrorHandler: { handleDatabaseError: vi.fn((e) => e) },
    validateSchema: vi.fn(),
  };
});

vi.mock('@services', async (importOriginal) => {
  const actual = await importOriginal<typeof services>();
  return {
    ...actual,
    metadata: vi.fn(() => vi.fn().mockResolvedValue({ fields: [] })),
  };
});

describe('Repository: createBulk', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create multiple entities successfully', async () => {
    const mockData = [{ name: 'Test1' }, { name: 'Test2' }];
    const mockTable = 'users';
    
    const createBulkFn = createBulk(mockTable);
    const result = await createBulkFn(mockData as any);

    expect(result).toEqual([{ id: 1, name: 'Test1' }, { id: 2, name: 'Test2' }]);
  });
});
