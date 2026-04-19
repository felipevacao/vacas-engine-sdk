import { describe, it, expect, vi, beforeEach } from 'vitest';
import { update } from './update';
import * as utils from '@utils';

vi.mock('@utils', async (importOriginal) => {
  const actual = await importOriginal<typeof utils>();
  return {
    ...actual,
    db: vi.fn(),
    apiError: class extends Error { status: number; constructor(m: string, s: number) { super(m); this.status = s; } },
    ErrorHandler: { handleDatabaseError: vi.fn((e) => e) },
    validateSchema: vi.fn(),
  };
});

vi.mock('@services', () => ({
  metadata: vi.fn(() => vi.fn().mockResolvedValue({ fields: [] })),
}));

describe('Repository: update', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should update an entity successfully', async () => {
    const mockData = { id: 1, name: 'Updated' };
    const mockTable = 'users';
    
    const mockDb = vi.fn().mockReturnThis();
    (utils.db as any).mockImplementation(mockDb);
    mockDb.mockReturnValue({
      where: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      returning: vi.fn().mockResolvedValue([mockData]),
    });

    const updateFn = update(mockTable);
    const result = await updateFn(1, { name: 'Updated' } as any);

    expect(result).toEqual(mockData);
  });
});
