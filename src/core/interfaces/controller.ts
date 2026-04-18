import {
	CreateData,
	UpdateData,
	QueryFields,
	OutputData,
	QueryFilter
} from '@app-types'
import { BaseEntity } from "./entity";
import { PaginatedResult } from '.';
import { Model } from './model';


export interface IController<T extends BaseEntity> {

	getModelTable(): string;
	getModel(): Model<T>;
	getDefaultFields(): (keyof T)[];
	getSelectetAbleFields(): (keyof T)[];
	getExcludedFields(): (keyof T)[];
	createEntity(data: CreateData<T>, options: QueryFields<T>): Promise<OutputData<T>>;
	findAllEntity(options: QueryFields<T>): Promise<OutputData<T>[]>;
	findAllEntityPaginated(options: QueryFields<T>): Promise<PaginatedResult<T>>;
	findByIdEntity(id: number | string, options: QueryFields<T>): Promise<OutputData<T> | undefined>;
	findByEntity(options: QueryFields<T>): Promise<OutputData<T>[] | undefined>;
	findByEntityPaginated(options: QueryFields<T>): Promise<PaginatedResult<T>>;
	updateEntity(id: number | string, data: UpdateData<T>, options: QueryFields<T>): Promise<OutputData<T>>;
	deleteEntity(id: number): Promise<boolean>;
	forceDeleteEntity(id: number): Promise<boolean>;
	count(options: QueryFields<T>): Promise<number>;
	getDefaultFilters(): QueryFilter[];

}