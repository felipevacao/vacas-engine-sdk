import { BaseController } from '@core/controllers';
import { BaseEntity, PaginatedResult } from '@interfaces';
import { Model } from "@interfaces";

export const GenericModel: Model<BaseEntity> = {
	table: 'vacas_',
	create: () => Promise.resolve({}),
	findAll: () => Promise.resolve([{}]),
	findAllPaginated: () => Promise.resolve({} as PaginatedResult<BaseEntity>),
	findById: () => Promise.resolve({}),
	findBy: () => Promise.resolve([{}]),
	findByPaginated: () => Promise.resolve({} as PaginatedResult<BaseEntity>),
	update: () => Promise.resolve({}),
	createBulk: () => Promise.resolve([]), // Não implementado,
	updateBulk: () => Promise.resolve([]), // Não implementado,,
	deleteBulk: () => Promise.resolve<boolean>(false), // Não implementado,,
	delete: () => Promise.resolve<boolean>(false), // Não implementado
	forceDelete: () => Promise.resolve<boolean>(false), // Não implementado,
	restore: () => Promise.resolve<boolean>(false), // Não implementado
	count: () => Promise.resolve(0),
	selectAbleFields: [],
	defaultFields: [],
	excludedFields: [],
	relations: {},
	metadata: (): null => null,
};

export class GenericController extends BaseController<BaseEntity> {
	constructor() {
		super(GenericModel);
	}
}