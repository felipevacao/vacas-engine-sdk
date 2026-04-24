import apiClient from './index';

export const metadataService = {
  getMetadata: async (module: string) => {
    return await apiClient.get(`/api/${module}/metadata`);
  }
};
