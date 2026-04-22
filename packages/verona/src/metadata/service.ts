import { ApiClientInterface, TableMetadata } from '../interfaces';
import apiClient from '../api/index';


export class MetadataService {
  constructor(private client: ApiClientInterface = apiClient) { }

  async getMetadata(entity: string): Promise<TableMetadata> {
    return this.client.get<TableMetadata>(`/${entity}/metadata`);
  }
}

export const metadataService = new MetadataService();
