import { describe, it, expect, vi, beforeEach } from 'vitest';
import { updateBulk } from './updateBulk';
import * as utils from '@utils';
import * as services from '@services';

vi.mock('@utils', async (importOriginal) => {
  const actual = await importOriginal<typeof utils>();
  
  const mockKnex = vi.fn().mockReturnValue({
    whereIn: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    returning: vi.fn().mockResolvedValue([{ id: 1, name: 'Test' }]),
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

describe('Repository: updateBulk', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should update multiple entities successfully', async () => {
    const mockIds = [1];
    const mockData = { name: 'Test' };
    const mockTable = 'users';
    
    const updateBulkFn = updateBulk(mockTable);
    const result = await updateBulkFn(mockIds, mockData as any);

    expect(result).toEqual([{ id: 1, name: 'Test' }]);
  });
});
