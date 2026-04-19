import { describe, it, expect, vi, beforeEach } from 'vitest';
import { deleteBulk } from './deleteBulk';
import * as utils from '@utils';

vi.mock('@utils', async (importOriginal) => {
  const actual = await importOriginal<typeof utils>();
  
  const mockKnex = vi.fn().mockReturnValue({
    whereIn: vi.fn().mockReturnThis(),
    whereNull: vi.fn().mockReturnThis(),
    update: vi.fn().mockResolvedValue(1),
  });

  return {
    ...actual,
    db: {
      ...actual.db,
      transaction: vi.fn((cb) => cb(mockKnex)),
    },
    ErrorHandler: { handleDatabaseError: vi.fn((e) => e) },
  };
});

describe('Repository: deleteBulk', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should delete multiple entities successfully', async () => {
    const mockIds = [1, 2];
    const mockTable = 'users';
    
    const deleteBulkFn = deleteBulk(mockTable);
    const result = await deleteBulkFn(mockIds);

    expect(result).toBe(true);
  });
});
