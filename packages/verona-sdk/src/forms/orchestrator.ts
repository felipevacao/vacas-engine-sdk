import { ApiClientInterface, FormState } from '@interfaces';
import apiClient from '../api/index';
import { MetadataService } from '../metadata/service';

export class FormOrchestrator {
  constructor(private client: ApiClientInterface = apiClient) { }

  async getFormConfig(entity: string, id?: string | number): Promise<FormState> {
    try {
      const metaService = new MetadataService(this.client);

      const metadata = await metaService.getMetadata(entity);

      // Prefetching: Se o formulário tem relacionamentos (selects), busca o metadata deles agora
      const relFields = metadata.fields.filter(f => f.crud?.searchable && f.formType === 'select');
      relFields.forEach(f => metaService.getMetadata(f.name).catch(() => {}));

      const data = id ? await this.client.get(`/${entity}/${id}`) : null;

      return { metadata, data, loading: false, error: null };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro ao carregar';
      return {
        metadata: { table: entity, displayName: entity, fields: [] },
        data: null,
        loading: false,
        error: message,
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
