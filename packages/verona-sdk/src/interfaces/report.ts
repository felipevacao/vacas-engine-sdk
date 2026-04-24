export interface CatalogItem {
  reportId: string;
  moduleId: string;
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
  };
}