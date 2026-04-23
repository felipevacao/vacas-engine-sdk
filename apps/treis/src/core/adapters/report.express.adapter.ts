import { Request, Response } from 'express';
import { ReportController } from '@controllers';
import { ResponseHandler, asyncHandler } from '@utils';
import { MESSAGES } from '@constants';
import { BaseEntity, InputRequest, ReportFilters } from '@interfaces';
import { BaseServices } from '@services';
import { QueryFields } from '@app-types';



export class ReportExpressAdapter<T extends BaseEntity> {
	private controller = new ReportController();

	handle = asyncHandler(async (req: Request, res: Response) => {

		const reportId = req.params.reportId as string;
		const options = this.reportQueryFields(req)

		const data = await this.controller.execute(reportId as string, options);
		ResponseHandler.success(res, data, MESSAGES.API.SUCCESS_DATA);

	});

	protected reportQueryFields(
		input: InputRequest<Request>
	): QueryFields<T> {
		const body = input.body as ReportFilters

		return {
			filters: body.filters ?? [],
			limit: body.limit ?? undefined,
			offset: body.offset ?? undefined,
			orderBy: body.orderBy ?? 'id',
			order: body.order as 'asc' | 'desc' ?? 'asc',
			page: body.page ?? undefined,
			pageSize: body.pageSize ?? undefined,
		}
	}
}
