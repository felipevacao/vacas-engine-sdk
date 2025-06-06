import env from "@lib/env"
import { BaseEntity, CreateData, Model, UpdateData, QueryFields, OutputData, InputRequest } from 'types/entity'

export class BaseController<T extends BaseEntity> {
    hateoas: boolean
    _bodyCreateExtended: boolean
    _bodyUpdateExtended: boolean
    _showErrors: boolean
    
    constructor(private model: Model<T>) {
        this.hateoas = env.ENABLE_HATEOAS ?? false
        this._bodyCreateExtended = false
        this._bodyUpdateExtended = false
        this._showErrors = env.ENABLE_RETURN_ERRORS
    }

    public getModelTable(): string {
        return this.model.table
    }

    public async generateBodyCreate(input: InputRequest<unknown>): Promise<CreateData<T> | null > {
        const body = input.body as CreateData<T>
        return this._bodyCreateExtended == false ? null : body
    }

    public async generateBodyUpdate(input: InputRequest<unknown>): Promise<UpdateData<T> | null> {
        const body = input.body as UpdateData<T>
        return this._bodyCreateExtended == false ? null : body
    }

    public getAvailableFields(extraFields: (keyof Model<T>)[] = []): (keyof Model<T>)[] {
        return ([
          ...this.model.defaultFields,
          ...this.model.selectAbleFields,
          ...extraFields
        ] as (keyof Model<T>)[]).filter((field) => !this.model.excludedFields.includes(field as keyof T))
    }

    public async createEntity(data: CreateData<T>, options: QueryFields<T>): Promise<OutputData<T>> {
        return await this.model.create(data, options)
    }
    
    public async findAllEntity(options: QueryFields<T>): Promise<OutputData<T>[]> {
        return await this.model.findAll(options)
    }

    public async findByIdEntity(id: number, options: QueryFields<T>): Promise<OutputData<T> | null> {
        const result = await this.model.findById(id, options)
        if(!result) {
            return null
        }
        return result
    }

    public async findByEntity(options: QueryFields<T>): Promise<OutputData<T>[] | []> {
        const result = await this.model.findBy(options)
        if(!result) {
            return []
        }
        return result
    }

    public async updateEntity(id: number | string, data: UpdateData<T>, options: QueryFields<T>): Promise<OutputData<T>> {
        return await this.model.update(id, data, options)
    }

    public async deleteEntity(id: number): Promise<boolean> {
        return await this.model.delete(id)
    }
    
    public async forceDeleteEntity(id: number): Promise<boolean> {
        return await this.model.forceDelete(id)
    }
    
}