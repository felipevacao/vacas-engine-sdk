import { reportRegistry } from '@services';
import { apiError } from '@utils';
import { MESSAGES } from '@constants';
import { QueryFields } from '@app-types';
import { BaseEntity, BaseView } from '@interfaces';

export class ReportController {
  async execute(reportId: string, options: QueryFields<BaseEntity | BaseView> = {}) {
    const provider = reportRegistry.getProvider(reportId as string);
    if (!provider) {
      throw new apiError(MESSAGES.DATABASE.ENTITY.NOT_FOUND, 404);
    }
    return await provider.generate(options);
  }
}
