import { QueryFields } from "@app-types";
import { BaseEntity, BaseView, ReportProvider, ReportResult } from "@interfaces";

export abstract class BaseReportProvider<T extends BaseEntity | BaseView, R> implements ReportProvider<T, R> {
	abstract moduleId: string;
	abstract reportId: string;
	abstract reportFields: Array<{
		name: string;
		label: string;
		type: string;
	}>;
	abstract fetchData(options: QueryFields<T>): Promise<R[]>;
	async generate(options: QueryFields<T>): Promise<ReportResult<R>> {
		const data = await this.fetchData(options);
		return {
			data: data,
			metadata: {
				total: data.length,
				generatedAt: new Date(),
				reportId: this.reportId,
				fields: this.reportFields,
				filters: options.filters
			}
		};

	}

}