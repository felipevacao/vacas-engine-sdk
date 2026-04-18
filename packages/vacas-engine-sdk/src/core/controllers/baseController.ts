import {
    CreateData,
    UpdateData,
    QueryFields,
    OutputData,
    QueryFilter
} from '@app-types'

import {
    IController,
    Model,
    BaseEntity,
    PaginatedResult
} from '@interfaces'

export abstract class BaseController<T extends BaseEntity> implements IController<T> {

    constructor(model: Model<T>) { }
    
    getModelTable(): string { return '' }
    getModel(): Model<T> { return {} as Model<T> }
    getDefaultFields(): (keyof T)[] { return [] }
    getSelectetAbleFields(): (keyof T)[] { return [] }
    getExcludedFields(): (keyof T)[] { return [] }
    async createEntity(data: CreateData<T>, options?: QueryFields<T>): Promise<OutputData<T>> { return {} as OutputData<T> }
    async findAllEntity(options: QueryFields<T>): Promise<OutputData<T>[]> { return [] as OutputData<T>[] }
    async findAllEntityPaginated(options: QueryFields<T>): Promise<PaginatedResult<T>> { return {} as PaginatedResult<T> }
    async findByIdEntity(id: number | string, options?: QueryFields<T>): Promise<OutputData<T> | undefined> { return {} as OutputData<T> }
    async findByEntity(options: QueryFields<T>): Promise<OutputData<T>[] | undefined> { return [] as OutputData<T>[] }
    async findByEntityPaginated(options: QueryFields<T>): Promise<PaginatedResult<T>> { return {} as PaginatedResult<T> }
    async updateEntity(id: number | string, data: UpdateData<T>, options?: QueryFields<T>): Promise<OutputData<T>> { return {} as OutputData<T> }
    async deleteEntity(id: number): Promise<boolean> { return false }
    async forceDeleteEntity(id: number): Promise<boolean> { return false }
    async count(options?: QueryFields<T>): Promise<number> { return 0 }
    getDefaultFilters(): QueryFilter[] { return [] }
}

