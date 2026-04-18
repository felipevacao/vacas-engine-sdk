import { CreateData, UpdateData, QueryFields, OutputData } from "@app-types";
import { BaseEntity, PaginatedResult } from "@interfaces";

export const create = <T extends BaseEntity>(table: string) =>
    async (data: CreateData<T>, options?: QueryFields<T>): Promise<OutputData<T>> => { throw new Error("SDK Skeleton"); };

export const read = <T extends BaseEntity>(table: string) => ({
    findAll: async (options: QueryFields<T>): Promise<OutputData<T>[]> => { throw new Error("SDK Skeleton"); },
    findAllPaginated: async (options: QueryFields<T>): Promise<PaginatedResult<T>> => { throw new Error("SDK Skeleton"); },
    findById: async (id: number | string, options?: QueryFields<T>): Promise<OutputData<T> | undefined> => { throw new Error("SDK Skeleton"); },
    findBy: async (options: QueryFields<T>): Promise<OutputData<T>[] | undefined> => { throw new Error("SDK Skeleton"); },
    findByPaginated: async (options: QueryFields<T>): Promise<PaginatedResult<T>> => { throw new Error("SDK Skeleton"); },
    count: async (options?: QueryFields<T>): Promise<number> => { throw new Error("SDK Skeleton"); },
});

export const update = <T extends BaseEntity>(table: string) =>
    async (id: number | string, data: UpdateData<T>, options?: QueryFields<T>): Promise<OutputData<T>> => { throw new Error("SDK Skeleton"); };

export const deleteById = <T extends BaseEntity>(table: string) =>
    async (id: number | string, options: QueryFields<T> = {}): Promise<boolean> => { throw new Error("SDK Skeleton"); };

export const forceDelete = <T extends BaseEntity>(table: string) =>
    async (id: number | string, options: QueryFields<T> = {}): Promise<boolean> => { throw new Error("SDK Skeleton"); };

export const metadata = (table: string) =>
    async (): Promise<any> => { throw new Error("SDK Skeleton"); };
