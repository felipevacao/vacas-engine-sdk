import env from "@lib/env"
import { BaseEntity, CreateData, Model, UpdateData, QueryFields, OutputData, InputRequest, Metadata, PaginatedResult } from 'types/entity'

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

    /**
     * Gets the table name of the model.
     * @returns string
     */
    public getModelTable(): string {
        return this.model.table
    }

    /**
     * Generates the body for creating a new entity.
     * @param input The input request containing the entity data.
     * @returns The create data for the entity or null if not extended.
     */
    public async generateBodyCreate(
        input: InputRequest<unknown>
    ): Promise<CreateData<T> | null > {

        const body = input.body as CreateData<T>
        return this._bodyCreateExtended == false ? null : body
    }

    /**
     * Generates the body for updating an existing entity.
     * @param input The input request containing the entity data.
     * @returns The update data for the entity or null if not extended.
     */
    public async generateBodyUpdate(
        input: InputRequest<unknown>
    ): Promise<UpdateData<T> | null> {
        const body = input.body as UpdateData<T>
        return this._bodyUpdateExtended == false ? null : body
    }

    /**
     * Gets the available fields for the model.
     * @param extraFields Additional fields to include.
     * @returns An array of available fields.
     */
    public getAvailableFields(
        extraFields: (keyof Model<T>)[] = []
    ): (keyof Model<T>)[] {

        return ([
          ...this.model.defaultFields,
          ...this.model.selectAbleFields,
          ...extraFields
        ] as (keyof Model<T>)[])
            .filter(
                (field) => !this.model.excludedFields.includes(field as keyof T)
            )

    }

    /**
     * Creates a new entity in the model.
     * @param data The data to create the entity with.
     * @param options The query fields for the creation.
     * @returns The created entity.
     */
    public async createEntity(
        data: CreateData<T>, 
        options: QueryFields<T>
    ): Promise<OutputData<T>> {

        return await this.model.create(data, options)

    }

    /**
     * Finds all entities in the model.
     * @param options The query fields for finding entities.
     * @returns An array of found entities.
     */
    public async findAllEntity(
        options: QueryFields<T>
    ): Promise<OutputData<T>[]> {

        return await this.model.findAll(options)

    }

    /**
     * Finds all entities in the model.
     * @param options The query fields for finding entities.
     * @returns An array of found entities.
     */
    public async findAllEntityPaginated(
        options: QueryFields<T>
    ): Promise<PaginatedResult<T>> {

        return await this.model.findAllPaginated(options) 

    }

    /**
     * Finds an entity by its ID.
     * @param id The ID of the entity to find.
     * @param options The query fields for finding the entity.
     * @returns The found entity or null if not found.
     */
    public async findByIdEntity(
        id: number, 
        options: QueryFields<T> = {}
    ): Promise<OutputData<T> | null> {

        const result = await this.model.findById(id, options)
        if(!result) {
            return null
        }
        return result

    }

    /**
     * Finds entities by specific fields.
     * @param options The query fields for finding entities.
     * @returns An array of found entities or an empty array if none found.
     */
    public async findByEntity(
        options: QueryFields<T>
    ): Promise<OutputData<T>[] | []> {

        const result = await this.model.findBy(options)
        if(!result) {
            return []
        }
        return result

    }

    /**
     * Finds entities by specific fields.
     * @param options The query fields for finding entities.
     * @returns An array of found entities or an empty array if none found.
     */
    public async findByEntityPaginated(
        options: QueryFields<T>
    ): Promise<PaginatedResult<T>> {

        return await this.model.findByPaginated(options)

    }

    /**
     * Updates an existing entity in the model.
     * @param id The ID of the entity to update.
     * @param data The data to update the entity with.
     * @param options The query fields for the update.
     * @returns The updated entity.
     */
    public async updateEntity(
        id: number | string, 
        data: UpdateData<T>, 
        options: QueryFields<T>
    ): Promise<OutputData<T>> {

        return await this.model.update(id, data, options)

    }

    /**
     * Deletes an entity by its ID, marrked as deleted.
     * @param id The ID of the entity to delete.
     * @returns A boolean indicating whether the deletion was successful.
     */
    public async deleteEntity(
        id: number
    ): Promise<boolean> {

        return await this.model.delete(id)

    }
    
    /**
     * Force deletes an entity by its ID. Deletes the entity without marking it as deleted.
     * @param id The ID of the entity to force delete.
     * @returns A boolean indicating whether the force deletion was successful.
     */
    public async forceDeleteEntity(
        id: number
    ): Promise<boolean> {

        return await this.model.forceDelete(id)

    }

    public async getMetadata(): Promise<Metadata | null>{
        return await this.model.metadata()
    }
}