import apiClient from './index';
import { CatalogItem, ReportResult } from '@interfaces'

export const reportService = {
  // Discovery: Busca a lista de relatórios disponíveis
  getCatalog: async (): Promise<CatalogItem[]> => {
    return await apiClient.get<CatalogItem[]>('/api/reports');
  },

  // Execução: Gera um relatório com filtros tipados
  generate: async <T, F>(reportId: string, filters: F): Promise<ReportResult<T>> => {
    return await apiClient.post<ReportResult<T>>(`/api/reports/${reportId}`, { filters });
  }
};
