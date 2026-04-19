import { OutputData, QueryFields, CreateData, UpdateData } from "@app-types";
import { BaseEntity } from "./entity";

export interface IBaseServices<T extends BaseEntity> {
	findEntityBy(options: QueryFields<BaseEntity>): Promise<OutputData<BaseEntity>[]>;
	getModelTable(): string;
	getAvailableFields(extraFields?: string[]): string[];
	// createMany(data: CreateData<T>[], options?: QueryFields<T>): Promise<OutputData<T>[]>;
	// updateMany(ids: (number | string)[], data: UpdateData<T>, options?: QueryFields<T>): Promise<OutputData<T>[]>;
	// deleteMany(ids: (number | string)[]): Promise<boolean>;
}