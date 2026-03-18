import env from "libs/env"
import { MESSAGES } from "@constants/messages";
import { BaseController } from "@controllers/baseController";
import { MetadataService } from "@services/metadataServices"
import { apiError } from "@utils/error";
import { ErrorService } from "./error";
import {
	BaseEntity,
	OutputData,
	ErrorContext,
	CreateData,
	Model,
	UpdateData,
	InputRequest,
	EnhancedTableMetadata,
	QueryFields,
	QueryFilter
} from 'types/entity'

export class BaseServices<T extends BaseEntity, C extends BaseController<T>> {

	protected errorService: ErrorService
	protected _entity!: OutputData<T>
	public id: number | string = 0 || ''
	protected _bodyCreateExtended: boolean
	protected _bodyUpdateExtended: boolean
	protected _showErrors: boolean
	protected _metadataService: MetadataService
	protected defaultFilters: QueryFilter[] = this.entityController.getDefaultFilters()

	constructor(
		protected entityController: C
	) {
		this.errorService = new ErrorService()
		this.context({ entity: this.getController().getModelTable() })
		this._bodyCreateExtended = false
		this._bodyUpdateExtended = false
		this._showErrors = env.ENABLE_RETURN_ERRORS
		this._metadataService = new MetadataService(this.getController().getModelTable())
	}

	validateId(id: number | string): asserts id is number | string {
		if (
			typeof id === 'number' && (!id || id <= 0 || !Number.isInteger(id) || id == 0)
			||
			typeof id === 'string' && (!id || id === '')
		) {
			throw new apiError(
				MESSAGES.DATABASE.ENTITY.INVALID_ID,
				400,
				this.getContext()
			)
		}
	}

	withId(
		id: number | string
	): this {
		this.context({ id })
		this.validateId(id)
		this.id = id
		return this
	}

	getController() {
		return this.entityController
	}

	async setEntity(): Promise<this> {
		this._entity = await this.findByIdEntity(this.id) as OutputData<T>
		return this
	}

	getEntity() {
		if (!this._entity) {
			throw new apiError(MESSAGES.DATABASE.ENTITY.NOT_FOUND)
		}
		return this._entity
	}

	protected context(
		metadata: Partial<ErrorContext>
	): this {
		this.errorService.setErrorMetadata(metadata)
		return this
	}

	contextDetail(
		metadata: string
	): this {
		this.errorService.setErrorMetadataDetails(metadata)
		return this
	}

	getContext() {
		return this.errorService.getErrorContext()
	}

	setDefaultFilters(options: QueryFields<T>): QueryFields<T> {
		const hasWhere = options.where && Object.keys(options.where).length > 0
		const hasFilters = options.filters && options.filters.length > 0

		options.filters = (hasWhere || hasFilters)
			? options.filters
			: this.defaultFilters
		return options
	}

	async generateBodyCreate(
		input: InputRequest<unknown>
	): Promise<CreateData<T> | null> {

		const body = input.body as CreateData<T>
		return this._bodyCreateExtended == false ? null : body
	}

	async generateBodyUpdate(
		input: InputRequest<unknown>
	): Promise<UpdateData<T> | null> {
		const body = input.body as UpdateData<T>
		return this._bodyUpdateExtended == false ? null : body
	}

	getAvailableFields(
		extraFields: (keyof Model<BaseEntity>)[] = []
	): (keyof Model<T>)[] {

		return ([
			...this.getController().getDefaultFields(),
			...this.getController().getSelectetAbleFields(),
			...extraFields
		] as (keyof Model<T>)[])
			.filter(
				(field) => !this.getController().getExcludedFields().includes(field as keyof BaseEntity)
			)

	}

	async findByIdEntity(
		...args: Parameters<BaseController<T>['findByIdEntity']>
	): Promise<OutputData<T>> {
		const result = await this.getController().findByIdEntity(args[0], args[1])
		if (!result) {
			throw new apiError(
				MESSAGES.DATABASE.ENTITY.NOT_FOUND,
				404,
				this.getContext()
			)
		}
		return result
	}

	async findEntityBy(
		...args: Parameters<BaseController<T>['findByEntity']>
	): Promise<Awaited<ReturnType<BaseController<T>['findByEntity']>>> {
		args[0] = this.setDefaultFilters(args[0])
		const result = await this.getController().findByEntity(args[0])
		if (!result) {
			return []
		}
		return result

	}

	async getMetadata(): Promise<EnhancedTableMetadata> {
		return await this._metadataService.getTableMetadata()
	}

	async createEntity(
		...args: Parameters<BaseController<T>['createEntity']>
	): Promise<Awaited<ReturnType<BaseController<BaseEntity>['createEntity']>>> {

		return await this.getController().createEntity(args[0], args[1])

	}

	getModelTable(): ReturnType<BaseController<BaseEntity>['getModelTable']> {
		return this.getController().getModelTable()
	}

	async findAllEntityPaginated(
		...args: Parameters<BaseController<T>['findAllEntityPaginated']>
	): Promise<Awaited<ReturnType<BaseController<BaseEntity>['findAllEntityPaginated']>>> {
		args[0] = this.setDefaultFilters(args[0])
		return await this.getController().findAllEntityPaginated(args[0])
	}

	async findByEntityPaginated(
		...args: Parameters<BaseController<T>['findByEntityPaginated']>
	): Promise<Awaited<ReturnType<BaseController<BaseEntity>['findByEntityPaginated']>>> {
		args[0] = this.setDefaultFilters(args[0])
		const result = await this.getController().findByEntityPaginated(args[0])
		if (result.data.length === 0) {
			throw new apiError(
				MESSAGES.ERROR.NOT_FOUND,
				404,
				this.getContext()
			)
		}
		return result
	}

	async updateEntity(
		...args: Parameters<BaseController<T>['updateEntity']>
	): Promise<Awaited<ReturnType<BaseController<BaseEntity>['updateEntity']>>> {
		return await this.getController().updateEntity(args[0], args[1], args[2])
	}

	async deleteEntity(
		...args: Parameters<BaseController<T>['deleteEntity']>
	): Promise<boolean> {
		const result = await this.withId(args[0]).getController().deleteEntity(args[0])
		if (!result) {
			throw new apiError(
				MESSAGES.ERROR.NOT_FOUND,
				404,
				this.getContext()
			)
		}
		return result
	}

	async forceDeleteEntity(
		...args: Parameters<BaseController<T>['deleteEntity']>
	): Promise<boolean> {
		const result = await this.withId(args[0]).getController().forceDeleteEntity(args[0])
		if (!result) {
			throw new apiError(
				MESSAGES.ERROR.NOT_FOUND,
				404,
				this.getContext()
			)
		}
		return result
	}

}	