import apiClient from '@api';
import { FormState } from '@interfaces';
import { metadataService } from '@metadata';

export class FormOrchestrator {
  async getFormConfig(entity: string, id?: string | number): Promise<FormState> {
    try {
      const [metadata, data] = await Promise.all([
        metadataService.getMetadata(entity),
        id ? apiClient.get(`/${entity}/${id}`) : Promise.resolve(null),
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
      return apiClient.put(`/${entity}/${id}`, data);
    }
    return apiClient.post(`/${entity}`, data);
  }
}

export const formOrchestrator = new FormOrchestrator();
