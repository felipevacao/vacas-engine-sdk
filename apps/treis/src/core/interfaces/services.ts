import { OutputData, QueryFields, CreateData, UpdateData } from "@app-types";
import { BaseEntity } from "./entity";

export type VirtualFieldResolver<T extends BaseEntity> = (row: T) => unknown;

export interface IVirtualFieldDefinition<T extends BaseEntity> {
	[fieldName: string]: VirtualFieldResolver<T>;
}

export interface IBaseServices<T extends BaseEntity> {
	findEntityBy(options: QueryFields<BaseEntity>): Promise<OutputData<BaseEntity>[]>;
	getModelTable(): string;
	getAvailableFields(extraFields?: string[]): string[];
	// ... rest of methods
}