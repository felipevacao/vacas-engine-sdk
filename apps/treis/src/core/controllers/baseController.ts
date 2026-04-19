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

    constructor(
        protected model: Model<T>
    ) { }

    public getModelTable(): string {
        return this.model.table
    }

    public getModel(): Model<T> {
        return this.model
    }

    public getDefaultFields(): (keyof T)[] {
        return this.model.defaultFields
    }

    public getSelectetAbleFields(): (keyof T)[] {
        return this.model.selectAbleFields
    }

    public getExcludedFields(): (keyof T)[] {
        return this.model.excludedFields
    }

    public async createEntity(
        data: CreateData<T>,
        options: QueryFields<T> = {}
    ): Promise<OutputData<T>> {
        return await this.model.create(data, options)
    }

    public async findAllEntity(
        options: QueryFields<T>
    ): Promise<OutputData<T>[]> {
        return await this.model.findAll(options)
    }

    public async findAllEntityPaginated(
        options: QueryFields<T>
    ): Promise<PaginatedResult<T>> {
        return await this.model.findAllPaginated(options)
    }

    public async findByIdEntity(
        id: number | string,
        options: QueryFields<T> = {}
    ): Promise<OutputData<T> | undefined> {
        return await this.model.findById(id, options)
    }

    public async findByEntity(
        options: QueryFields<T>
    ): Promise<OutputData<T>[] | undefined> {
        return await this.model.findBy(options)
    }

    public async findByEntityPaginated(
        options: QueryFields<T>
    ): Promise<PaginatedResult<T>> {
        return await this.model.findByPaginated(options)
    }

    public async updateEntity(
        id: number | string,
        data: UpdateData<T>,
        options: QueryFields<T> = {}
    ): Promise<OutputData<T>> {
        return await this.model.update(id, data, options)
    }

    public async createBulkEntity(
        data: CreateData<T>[],
        options: QueryFields<T> = {}
    ): Promise<OutputData<T>[]> {
        return await this.model.createBulk(data, options)
    }

    public async updateBulkEntity(
        ids: (number | string)[],
        data: UpdateData<T>,
        options: QueryFields<T> = {}
    ): Promise<OutputData<T>[]> {
        return await this.model.updateBulk(ids, data, options)
    }

    public async deleteBulkEntity(
        ids: (number | string)[]
    ): Promise<boolean> {
        return await this.model.deleteBulk(ids)
    }

    public async deleteEntity(
        id: number
    ): Promise<boolean> {
        return await this.model.delete(id)
    }

    public async forceDeleteEntity(
        id: number
    ): Promise<boolean> {
        return await this.model.forceDelete(id)
    }

    public async count(
        options: QueryFields<T> = {}
    ): Promise<number> {
        return await this.model.count(options)
    }

    public getDefaultFilters(): QueryFilter[] {
        return []
    }

}