import { TreisClient } from './treis';
import { reportService } from './report.service';
import * as hateoas from '../libs/hateoas';

/**
 * Instância Singleton padrão para uso geral no SDK.
 */
const apiClient = new TreisClient();

export { TreisClient, reportService, hateoas };
export default apiClient;
