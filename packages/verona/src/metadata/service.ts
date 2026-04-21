import apiClient from '@api';
import { TableMetadata } from '@interfaces';

export class MetadataService {
  async getMetadata(entity: string): Promise<TableMetadata> {
    return apiClient.get<TableMetadata>(`/${entity}/metadata`);
  }
}

export const metadataService = new MetadataService();
