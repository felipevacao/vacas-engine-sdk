import {
    BaseEntity,
    CreateData,
    Model,
    UpdateData,
    QueryFields,
    OutputData,
    PaginatedResult,
    QueryFilter
} from '@app-types/entity'

export class BaseController<T extends BaseEntity> {

    constructor(
        protected model: Model<T>
    ) { }

    public getModelTable(): string {
        return this.model.table
    }

    public getDefaultFields() {
        return this.model.defaultFields
    }

    public getSelectetAbleFields() {
        return this.model.selectAbleFields
    }

    public getExcludedFields() {
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

    public getDefaultFilters(): QueryFilter[] {
        return []
    }

}