import {
    OutputData,
    ErrorContext,
    CreateData,
    UpdateData,
    QueryFields,
    QueryFilter
} from '@app-types'
import {
    IBaseServices,
    EnhancedTableMetadata,
    Model,
    BaseEntity,
    InputRequest,
    PaginatedResult
} from "@interfaces";
import { BaseController } from '@controllers';
import { ErrorService } from './error';
import { MetadataService } from './metadataServices';

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

    constructor(protected entityController: C) {
        this.errorService = new ErrorService();
        this._metadataService = new MetadataService(this.entityController.getModelTable());
        this.defaultFilters = this.entityController.getDefaultFilters();
    }
    public getController(): C { return {} as C }
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
}
