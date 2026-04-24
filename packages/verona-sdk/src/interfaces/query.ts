export interface QueryFilter {
    field: string
    operator: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'LIKE' | 'IN' | 'BETWEEN'
    value: string | number | boolean | Date | (string | number)[]
}

export interface QueryFields {
    fields?: string[];
    where?: Record<string, unknown>;
    filters?: QueryFilter[];
    limit?: number;
    offset?: number;
    orderBy?: string;
    order?: 'asc' | 'desc';
    page?: number;
    pageSize?: number;
}
