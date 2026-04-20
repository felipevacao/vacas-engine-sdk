import { OutputData, QueryFields } from "@app-types";
import { BaseEntity } from "./entity";

export interface IBaseServices {
	findEntityBy(options: QueryFields<BaseEntity>): Promise<OutputData<BaseEntity>[]>;
	getModelTable(): string;
	getAvailableFields(extraFields?: string[]): string[];
}

export type VirtualFieldResolver<T extends BaseEntity> = (row: T) => unknown;

export interface IVirtualFieldDefinition<T extends BaseEntity> {
	[fieldName: string]: VirtualFieldResolver<T>;
}
