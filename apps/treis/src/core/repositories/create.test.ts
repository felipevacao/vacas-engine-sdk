import { describe, it, expect, vi, beforeEach } from 'vitest';
import { create } from './create';
import { db, ErrorHandler, validateSchema } from '@utils';
import { metadata } from '@services';

// Mock das dependências
vi.mock('@utils', () => ({
  db: vi.fn(),
  ErrorHandler: { handleDatabaseError: vi.fn((e) => e) },
  validateSchema: vi.fn(),
}));

vi.mock('@services', () => ({
  metadata: vi.fn(),
}));

describe('Repository: create', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create an entity successfully', async () => {
    const mockData = { name: 'Test' };
    const mockTable = 'users';

    // Configura mocks
    const mockDb = vi.fn().mockReturnThis();
    (db as any).mockImplementation(mockDb);
    mockDb.mockReturnValue({
      insert: vi.fn().mockReturnThis(),
      returning: vi.fn().mockResolvedValue([mockData]),
    });
    (metadata as any).mockReturnValue(vi.fn().mockResolvedValue({ fields: [] }));

    const createFn = create(mockTable);
    const result = await createFn(mockData as any);

    expect(result).toEqual(mockData);
    expect(mockDb).toHaveBeenCalledWith(mockTable);
  });
});
