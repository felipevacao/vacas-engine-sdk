import { OutputData, QueryFields } from "@app-types";
import { BaseEntity } from "./entity";

export interface IBaseServices {
	findEntityBy(options: QueryFields<BaseEntity>): Promise<OutputData<BaseEntity>[]>;
	getModelTable(): string;
	getAvailableFields(extraFields?: string[]): string[];
}