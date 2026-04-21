import { ApiClientInterface } from '@interfaces';
import { TreisClient } from './treis';
import env from '@libs/env';

/**
 * Factory para criar clientes de API baseados na configuração de ambiente.
 * Permite instanciar múltiplos clientes se necessário (sessões diferentes).
 */
export function createApiClient(): ApiClientInterface {
	switch (env.API_CLIENT) {
		case 'treis':
			return new TreisClient();
		default:
			throw new Error(`Unsupported API client: ${env.API_CLIENT}`);
	}
}

/**
 * Instância Singleton padrão para uso geral no SDK.
 */
const apiClient = createApiClient();

export { TreisClient };
export default apiClient;
