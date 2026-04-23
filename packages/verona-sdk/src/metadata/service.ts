import { ApiClientInterface, TableMetadata } from '@interfaces';
import apiClient from '../api/index';

export class MetadataService {
  private static cache: Map<string, { data: TableMetadata, timestamp: number }> = new Map();
  private readonly CACHE_TTL = 1000 * 60 * 5; // 5 minutos de cache

  constructor(private client: ApiClientInterface = apiClient) { }

  async getMetadata(entity: string): Promise<TableMetadata> {
    const cached = MetadataService.cache.get(entity);
    if (cached && (Date.now() - cached.timestamp) < this.CACHE_TTL) {
      return cached.data;
    }

    const metadata = await this.client.get<TableMetadata>(`/${entity}/metadata`);

    MetadataService.cache.set(entity, {
      data: metadata,
      timestamp: Date.now()
    });

    return metadata;
  }

  static clearCache(entity?: string) {
    if (entity) this.cache.delete(entity);
    else this.cache.clear();
  }
}

export const metadataService = new MetadataService();

