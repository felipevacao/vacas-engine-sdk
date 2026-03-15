import env from "@lib/env"
import { MESSAGES } from "@constants/messages";
import { BaseController } from "@controllers/baseController";
import { MetadataService } from "@services/metadataServices"
import { apiError } from "@utils/error";
import { ErrorService } from "./erro";
import {
	BaseEntity,
	OutputData,
	ErrorContext,
	CreateData,
	Model,
	UpdateData,
	InputRequest,
	EnhancedTableMetadata
} from 'types/entity'

export class BaseServices<T extends BaseEntity, C extends BaseController<T>> {

	protected errorService: ErrorService
	protected entity: OutputData<BaseEntity> | null = null
	protected id: number = 0
	protected _bodyCreateExtended: boolean
	protected _bodyUpdateExtended: boolean
	protected _showErrors: boolean
	protected _metadataService: MetadataService

	constructor(
		protected entityController: C,
	) {
		this.errorService = new ErrorService()
		this.context({ entity: this.getController().getModelTable() })
		this._bodyCreateExtended = false
		this._bodyUpdateExtended = false
		this._showErrors = env.ENABLE_RETURN_ERRORS
		this._metadataService = new MetadataService(this.getController().getModelTable())
	}

	validateId(id: number): asserts id is number {
		if (
			!id
			|| typeof id !== 'number'
			|| id <= 0
			|| !Number.isInteger(id)
			|| id == 0
		) {
			throw new apiError(
				MESSAGES.DATABASE.ENTITY.INVALID_ID,
				400,
				this.getContext()
			)
		}
	}

	withId(
		id: number
	): this {
		this.validateId(id)
		this.context({ id })
		this.id = id
		return this
	}

	getController() {
		return this.entityController
	}

	private context(
		metadata: Partial<ErrorContext>
	): this {
		this.errorService.setErrorMetadata(metadata)
		return this
	}

	private getContext() {
		return this.errorService.getErrorContext()
	}

	async getEntity() {
		this.entity = await this.findByIdEntity(this.id)
		return this.entity
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
	): Promise<OutputData<BaseEntity>> {
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
	): Promise<Awaited<ReturnType<BaseController<BaseEntity>['findByEntity']>>> {

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
		return await this.getController().findAllEntityPaginated(args[0])
	}

	async findByEntityPaginated(
		...args: Parameters<BaseController<T>['findByEntityPaginated']>
	): Promise<Awaited<ReturnType<BaseController<BaseEntity>['findByEntityPaginated']>>> {

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