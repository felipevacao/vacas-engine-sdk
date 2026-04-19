import { describe, it, expect, vi, beforeEach } from 'vitest';
import { deleteById } from './delete';
import * as utils from '@utils';

vi.mock('@utils', async (importOriginal) => {
  const actual = await importOriginal<typeof utils>();
  return {
    ...actual,
    db: vi.fn(),
    apiError: class extends Error { status: number; constructor(m: string, s: number) { super(m); this.status = s; } },
    ErrorHandler: { handleDatabaseError: vi.fn((e) => e) },
  };
});

describe('Repository: delete', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should delete an entity successfully', async () => {
    const mockTable = 'users';

    const mockDb = vi.fn().mockReturnThis();
    (utils.db as any).mockImplementation(mockDb);
    mockDb.mockReturnValue({
      where: vi.fn().mockReturnThis(),
      whereNull: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      returning: vi.fn().mockResolvedValue([1]),
    });

    const deleteFn = deleteById(mockTable);
    const result = await deleteFn(1);

    expect(result).toBe(true);
  });
});
