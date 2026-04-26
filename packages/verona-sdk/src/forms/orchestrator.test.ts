import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FormOrchestrator } from './orchestrator';
import { MetadataService } from '../metadata/service';

const mockGetMetadata = vi.fn();

// Mock MetadataService
vi.mock('../metadata/service', () => ({
  MetadataService: vi.fn().mockImplementation(() => ({
    getMetadata: mockGetMetadata,
  })),
  metadataService: {
    clearCache: vi.fn(),
  },
}));

describe('FormOrchestrator', () => {
  let orchestrator: FormOrchestrator;
  let mockClient: any;

  beforeEach(() => {
    mockClient = {
      get: vi.fn(),
      post: vi.fn(),
      patch: vi.fn(),
      delete: vi.fn(),
    };
    // Clear mock calls for the MetadataService constructor and its getMetadata method
    vi.mocked(MetadataService).mockClear();
    mockGetMetadata.mockClear();
    
    // Instantiate FormOrchestrator with the mocked client
    orchestrator = new FormOrchestrator(mockClient);
  });

  it('deve buscar configuração de formulário sem dados (modo criação)', async () => {
    const mockMetadata = {
      table: 'users',
      displayName: 'Users',
      fields: [{ name: 'name', type: 'varchar', label: 'Nome', required: true, formType: 'text' }]
    };

    // Configure o mock para o getMetadata
    mockGetMetadata.mockResolvedValueOnce(mockMetadata);
    mockClient.get.mockResolvedValueOnce({}); // Ensure client.get doesn't throw if called unexpectedly

    const result = await orchestrator.getFormConfig('users');

    expect(mockGetMetadata).toHaveBeenCalledWith('users');
    expect(result.metadata.table).toBe('users');
    expect(result.data).toBeNull();
    expect(result.loading).toBe(false);
    expect(result.error).toBeNull();
  });

  it('deve buscar configuração com dados (modo edição)', async () => {
    const mockMetadata = { table: 'users', displayName: 'Users', fields: [] };
    const mockData = { id: 1, name: 'Felipe' };

    // Mock MetadataService.getMetadata
    mockGetMetadata.mockResolvedValueOnce(mockMetadata);
    // Mock client.get for data retrieval
    mockClient.get.mockResolvedValueOnce(mockData);     

    const result = await orchestrator.getFormConfig('users', 1);

    expect(mockGetMetadata).toHaveBeenCalledWith('users');
    expect(mockClient.get).toHaveBeenCalledWith('/users/1'); // Ensure it calls for data
    expect(result.data).toEqual(mockData);
    expect(result.metadata).toEqual(mockMetadata); // Should return the mocked metadata
    expect(result.error).toBeNull();
    expect(mockClient.get).toHaveBeenCalledTimes(1); // Only for data, metadata is mocked
  });

  it('deve tratar erro na busca de metadata', async () => {
    // Mock MetadataService.getMetadata to reject
    mockGetMetadata.mockRejectedValueOnce(new Error('Falha na API'));

    const result = await orchestrator.getFormConfig('users');

    expect(mockGetMetadata).toHaveBeenCalledWith('users');
    expect(result.error).toBe('Falha na API');
    expect(result.metadata.table).toBe('users'); // Should still return a fallback metadata
  });
});
