import {
	OutputData,
	ErrorContext,
	CreateData,
	UpdateData,
	QueryFields,
	QueryFilter
} from '../types'
import {
	IBaseServices,
	EnhancedTableMetadata,
	BaseEntity,
	PaginatedResult,
	IVirtualFieldDefinition
} from "../interfaces";
import { BaseController } from '../controllers';

/**
 * SDK BaseServices Skeleton.
 * Provides 100% parity with core protected properties and methods.
 */
export abstract class BaseServices<T extends BaseEntity, C extends BaseController<T>> implements IBaseServices {
	public id: number | string = 0;
	protected errorService: ErrorService;
	protected _entity!: OutputData<T>;
	protected _bodyCreateExtended: boolean = false;
	protected _bodyUpdateExtended: boolean = false;
	protected _showErrors: boolean = false;
	protected _metadataService: MetadataService;
	protected defaultFilters: QueryFilter[] = [];

	constructor(
		protected entityController: C, virtualFields?: IVirtualFieldDefinition<T>
	) {
		this.errorService = new ErrorService();
		this._metadataService = new MetadataService(this.entityController.getModelTable());
		this.defaultFilters = this.entityController.getDefaultFilters();
	}
	public getController(): C { return this.entityController as C }
	public async findByIdEntity(id: number | string, options?: QueryFields<T>): Promise<OutputData<T>> { return {} as OutputData<T> }
	public async findEntityBy(options: QueryFields<T>): Promise<OutputData<T>[]> { return [] as OutputData<T>[] }
	public async createEntity(data: CreateData<T>): Promise<OutputData<T>> { return {} as OutputData<T> }
	public async updateEntity(id: number | string, data: UpdateData<T>): Promise<OutputData<T>> { return {} as OutputData<T> }
	public async deleteEntity(id: number | string): Promise<boolean> { return false }
	public async forceDeleteEntity(id: number | string): Promise<boolean> { return false }
	public async findAllEntityPaginated(options: QueryFields<T>): Promise<PaginatedResult<T>> { return {} as PaginatedResult<T> }
	public async findByEntityPaginated(options: QueryFields<T>): Promise<PaginatedResult<T>> { return {} as PaginatedResult<T> }
	public async countAll(options?: QueryFields<T>): Promise<number> { return 0 }
	public getAvailableFields(extraFields?: string[]): string[] { return [] }
	public getModelTable(): string { return '' }
	protected context(metadata: Partial<ErrorContext>): this { return {} as this }
	protected contextDetail(detail: string): this { return {} as this }
	protected async generateBodyCreate(input: any): Promise<CreateData<T> | null> { return null }
	protected async generateBodyUpdate(input: any): Promise<UpdateData<T> | null> { return null }
	async createMany(data: CreateData<T>[], options: QueryFields<T> = {}): Promise<OutputData<T>[]> { return [] as OutputData<T>[] }
	async updateMany(ids: (number | string)[], data: UpdateData<T>, options: QueryFields<T> = {}): Promise<OutputData<T>[]> { return [] as OutputData<T>[] }
	async deleteMany(ids: (number | string)[]): Promise<boolean> { return false }
}

/**
 * SDK ErrorService Skeleton.
 */
export class ErrorService {
	public setErrorMetadata(metadata: Partial<ErrorContext>): void { }
	public setErrorMetadataDetails(details: string): void { }
	public getErrorContext(): ErrorContext { return {} }
}

/**
 * SDK MetadataService Skeleton.
 */
export class MetadataService {
	constructor(private tableName: string) { }

	async getTableMetadata(): Promise<EnhancedTableMetadata> {
		throw new Error("SDK Skeleton: Real implementation in Treis Engine.");
	}
}


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

export const restoreById = <T extends BaseEntity>(table: string) =>
	async (id: number | string, options: QueryFields<T> = {}): Promise<boolean> => { throw new Error("SDK Skeleton"); };

export const forceDelete = <T extends BaseEntity>(table: string) =>
	async (id: number | string, options: QueryFields<T> = {}): Promise<boolean> => { throw new Error("SDK Skeleton"); };

export const metadata = (table: string) =>
	async (): Promise<any> => { throw new Error("SDK Skeleton"); };

export const createBulk = <T extends BaseEntity>(table: string) =>
	async (data: UpdateData<T>[], options?: QueryFields<T>): Promise<OutputData<T>[]> => { throw new Error("SDK Skeleton"); };

export const updateBulk = <T extends BaseEntity>(table: string) =>
	async (ids: (number | string)[], data: UpdateData<T>, options: QueryFields<T> = {}): Promise<OutputData<T>[]> => { throw new Error("SDK Skeleton"); };

export const deleteBulk = <T extends BaseEntity>(table: string) =>
	async (ids: (number | string)[], options: QueryFields<T> = {}): Promise<boolean> => { throw new Error("SDK Skeleton"); };

export class ServiceFactory {
	static register(name: string, factory: () => any): void { }
	static get(name: string): any { return null }
}
