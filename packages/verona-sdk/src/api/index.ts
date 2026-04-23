import { TreisClient } from './treis';

/**
 * Instância Singleton padrão para uso geral no SDK.
 */
const apiClient = new TreisClient();

export { TreisClient };
export default apiClient;
