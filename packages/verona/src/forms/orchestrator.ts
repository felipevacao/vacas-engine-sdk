import { ApiClientInterface, FormState } from '../interfaces';
import apiClient from '../api/index';
import { MetadataService } from '../metadata/service';

export class FormOrchestrator {
  constructor(private client: ApiClientInterface = apiClient) { }

  async getFormConfig(entity: string, id?: string | number): Promise<FormState> {
    try {
      // Injeta o cliente atual no serviço de metadata
      const metaService = new MetadataService(this.client);
      
      const [metadata, data] = await Promise.all([
        metaService.getMetadata(entity),
        id ? this.client.get(`/${entity}/${id}`) : Promise.resolve(null),
      ]);

      return {
        metadata,
        data,
        loading: false,
        error: null,
      };
    } catch (error: unknown) {
      return {
        metadata: { table: entity, fields: [] },
        data: null,
        loading: false,
        error: error instanceof Error ? error.message : 'Erro ao carregar configuração do formulário',
      };
    }
  }

  async submitForm(entity: string, data: unknown, id?: string | number): Promise<unknown> {
    if (id) {
      return this.client.patch(`/${entity}/${id}`, data);
    }
    return this.client.post(`/${entity}`, data);
  }
}

export const formOrchestrator = new FormOrchestrator();
