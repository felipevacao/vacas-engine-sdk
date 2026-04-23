import { QueryFields } from "@app-types";
import { BaseEntity, BaseView, ReportFilters } from ".";

export interface ReportProvider<T = unknown, R = unknown> {
  moduleId: string;
  generate(options: QueryFields<BaseEntity | BaseView>): Promise<ReportResult<R>>;
}

export interface ReportResult<T> {
  data: T[];
  metadata: {
    total: number;
    generatedAt: Date;
    reportId: string;
    fields: Array<{
      name: string;
      label: string;
      type: string;
    }>;
    filters: any;
  }
}
