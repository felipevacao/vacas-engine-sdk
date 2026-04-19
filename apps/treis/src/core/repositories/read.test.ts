import { describe, it, expect, vi, beforeEach } from 'vitest';
import { read } from './read';
import * as utils from '@utils';

vi.mock('@utils', async (importOriginal) => {
  const actual = await importOriginal<typeof utils>();
  return {
    ...actual,
    db: vi.fn(),
    ErrorHandler: { handleDatabaseError: vi.fn((e) => e) },
  };
});

describe('Repository: read', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should find an entity by ID successfully', async () => {
    const mockData = { id: 1, name: 'Test' };
    const mockTable = 'users';
    
    const mockDb = vi.fn().mockReturnThis();
    (utils.db as any).mockImplementation(mockDb);
    mockDb.mockImplementation(() => ({
      select: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      whereNull: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      offset: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockReturnThis(),
      then: (resolve: any) => resolve([mockData]),
    }));

    const readRepo = read(mockTable);
    const result = await readRepo.findById(1);

    expect(result).toEqual(mockData);
  });
});