import { OutputData, QueryFields } from "@app-types";
import { BaseView, PaginatedResult } from '.';

export interface ModelView<T extends BaseView> {
    table: string,
    findAll: (options: QueryFields<T>) => Promise<OutputData<T>[]>,
    findAllPaginated: (options: QueryFields<T>) => Promise<PaginatedResult<T>>,
    findBy: (options: QueryFields<T>) => Promise<OutputData<T>[] | undefined>,
    findByPaginated: (options: QueryFields<T>) => Promise<PaginatedResult<T>>,
    count: (options?: QueryFields<T>) => Promise<number>,
    selectAbleFields: (keyof T)[],
    defaultFields: (keyof T)[],
    excludedFields: (keyof T)[]
}