import { describe, it, expect, vi, beforeEach } from 'vitest';
import { readView } from './readView';
import * as utils from '@utils';

vi.mock('@utils', async (importOriginal) => {
  const actual = await importOriginal<typeof utils>();
  return {
    ...actual,
    db: vi.fn(),
    ErrorHandler: { handleDatabaseError: vi.fn((e) => e) },
  };
});

describe('Repository: readView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should find all records from a view without filtering deletedAt', async () => {
    const mockData = [{ name: 'Test1' }, { name: 'Test2' }];
    const mockView = 'vw_user_list';
    
    // Configura o mock do Knex para capturar a chamada
    const mockSelect = vi.fn().mockReturnThis();
    const mockDb = vi.fn().mockReturnValue({
      select: mockSelect,
      where: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      offset: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockReturnThis(),
      then: (resolve: any) => resolve(mockData),
    });
    
    (utils.db as any).mockImplementation(mockDb);

    const viewRepo = readView(mockView);
    const result = await viewRepo.findAll();

    expect(result).toEqual(mockData);
    
    // Verifica que chamou a view correta
    expect(mockDb).toHaveBeenCalledWith(mockView);
    
    // Verifica que a query não adicionou o filtro de deletados
    const lastCall = mockDb.mock.results[0].value;
    expect(lastCall.whereNull).toBeUndefined();
  });

  it('should return empty array if no data is found', async () => {
    const mockView = 'vw_user_list';
    
    const mockDb = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      offset: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockReturnThis(),
      then: (resolve: any) => resolve([]),
    });
    (utils.db as any).mockImplementation(mockDb);

    const viewRepo = readView(mockView);
    const result = await viewRepo.findAll();

    expect(result).toEqual([]);
  });
});
