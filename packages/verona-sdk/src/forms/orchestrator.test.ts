import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FormOrchestrator } from './orchestrator';

describe('FormOrchestrator', () => {
  let orchestrator: any;
  let mockClient: any;

  beforeEach(() => {
    mockClient = {
      get: vi.fn(),
      post: vi.fn(),
      patch: vi.fn(),
      delete: vi.fn(),
    };
    orchestrator = new FormOrchestrator(mockClient);
  });

  it('deve buscar configuração de formulário sem dados (modo criação)', async () => {
    const mockMetadata = {
      table: 'users',
      fields: [{ name: 'name', type: 'varchar', label: 'Nome', required: true }]
    };

    // Mock do MetadataService (que usa o client internamente)
    mockClient.get.mockResolvedValueOnce(mockMetadata);

    const result = await orchestrator.getFormConfig('users');

    expect(result.metadata.table).toBe('users');
    expect(result.data).toBeNull();
    expect(result.loading).toBe(false);
  });

  it('deve buscar configuração com dados (modo edição)', async () => {
    const mockMetadata = { table: 'users', fields: [] };
    const mockData = { id: 1, name: 'Felipe' };

    mockClient.get.mockResolvedValueOnce(mockMetadata); // Chamada do metadata
    mockClient.get.mockResolvedValueOnce(mockData);     // Chamada do registro id=1

    const result = await orchestrator.getFormConfig('users', 1);

    expect(result.data).toEqual(mockData);
    expect(mockClient.get).toHaveBeenCalledTimes(2);
  });

  it('deve tratar erro na busca de metadata', async () => {
    mockClient.get.mockRejectedValue(new Error('Falha na API'));

    const result = await orchestrator.getFormConfig('users');

    expect(result.error).toBe('Falha na API');
    expect(result.metadata.fields).toHaveLength(0);
  });
});
