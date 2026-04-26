import env from "@libs/env"
import { MESSAGES, HttpStatus } from "@constants";
import { BaseController } from "@controllers";
import { apiError, ErrorHandler, validateSchemaBulk } from "@utils";
import { ErrorService } from "./error";
import { ServiceFactory } from "./serviceFactory";
import { MetadataService } from "./metadataServices"
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
	IVirtualFieldDefinition
} from "@interfaces";

export class BaseServices<T extends BaseEntity, C extends BaseController<T>> implements IBaseServices<T> {

	protected errorService: ErrorService
	protected _entity!: OutputData<T>
	public id: number | string = 0
	protected _bodyCreateExtended: boolean
	protected _bodyUpdateExtended: boolean
	protected _showErrors: boolean
	protected _metadataService: MetadataService
	protected defaultFilters: QueryFilter[] = this.entityController.getDefaultFilters()

	constructor(
		protected entityController: C,
		protected virtualFields?: IVirtualFieldDefinition<T>
	) {
		this.errorService = new ErrorService()
		this.context({ entity: this.getController().getModelTable() })
		this._bodyCreateExtended = false
		this._bodyUpdateExtended = false
		this._showErrors = env.ENABLE_RETURN_ERRORS
		this._metadataService = new MetadataService(this.getController().getModelTable())
	}

	/**
	 * Aplica os campos virtuais definidos no módulo aos dados de saída.
	 */
	protected applyVirtualFields(data: OutputData<T>): OutputData<T>;
	protected applyVirtualFields(data: OutputData<T>[]): OutputData<T>[];
	protected applyVirtualFields(data: OutputData<T> | OutputData<T>[]): OutputData<T> | OutputData<T>[] {
		if (!this.virtualFields) return data;

		const applyToRow = (row: OutputData<T>) => {
			const virtuals = this.virtualFields!;
			for (const field in virtuals) {
				(row as Record<string, unknown>)[field] = virtuals[field](row as unknown as T);
			}
			return row;
		};

		if (Array.isArray(data)) {
			return data.map(applyToRow);
		}

		return applyToRow(data);
	}

	/**
	 * Carrega as relações solicitadas para um conjunto de dados.
	 */
	protected async loadRelations(data: OutputData<T>[], includes: string[]): Promise<OutputData<T>[]> {
		const model = this.getController().getModel();
		const relations = model.relations;

		if (!relations) return data;

		for (const relName of includes) {
			const relation = relations[relName];
			if (!relation) continue;

			const relatedService = ServiceFactory.get(relation.table);
			if (!relatedService) {
				console.warn(`[BaseServices] Service for table ${relation.table} not found in ServiceFactory.`);
				continue;
			}

			const ids = [...new Set(data.map(item => (item as unknown as Record<string, unknown>)[relation.localKey]).filter((id): id is string | number => id != null))];
			if (ids.length === 0) continue;

			// Busca os dados relacionados usando o Service daquela entidade
			// Isso garante que campos excluídos, sensíveis e lógicas de negócio sejam respeitados
			const relatedItems = await relatedService.findEntityBy({
				filters: [{
					field: relation.foreignKey,
					operator: 'IN',
					value: ids
				}]
			}) as OutputData<BaseEntity>[];

			if (relation.type === 'belongsTo' || relation.type === 'hasOne') {
				const relatedMap = new Map<string | number, OutputData<BaseEntity>>(
					relatedItems.map(item => [(item as unknown as Record<string, string | number>)[relation.foreignKey], item])
				);
				data.forEach(item => {
					const localKeyValue = (item as unknown as Record<string, string | number>)[relation.localKey];
					(item as unknown as Record<string, unknown>)[relName] = relatedMap.get(localKeyValue) || null;
				});
			} else if (relation.type === 'hasMany') {
				const relatedMap = new Map<string | number, OutputData<BaseEntity>[]>();
				relatedItems.forEach(item => {
					const key = (item as unknown as Record<string, string | number>)[relation.foreignKey];
					if (!relatedMap.has(key)) relatedMap.set(key, []);
					relatedMap.get(key)!.push(item);
				});

				data.forEach(item => {
					const localKeyValue = (item as unknown as Record<string, string | number>)[relation.localKey];
					(item as unknown as Record<string, unknown>)[relName] = relatedMap.get(localKeyValue) || [];
				});
			}
		}
		return data;
	}

	validateId(id: number | string): asserts id is number | string {
		if (
			typeof id === 'number' && (!id || id <= 0 || !Number.isInteger(id) || id == 0)
			||
			typeof id === 'string' && (!id || id === '')
		) {
			throw new apiError(
				MESSAGES.DATABASE.ENTITY.INVALID_ID,
				HttpStatus.FORBIDDEN,
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

	async setEntity(options: QueryFields<T> = {}): Promise<this> {
		this._entity = await this.findByIdEntity(this.id, options) as OutputData<T>
		return this
	}

	getEntity(): OutputData<T> {
		if (!this._entity) {
			throw new apiError(
				MESSAGES.DATABASE.ENTITY.NOT_FOUND,
				HttpStatus.NOT_FOUND,
				this.getContext()
			)
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

	/**
	 * Define os campos padrão caso nenhum tenha sido solicitado.
	 */
	setDefaultFields(options: QueryFields<T>): QueryFields<T> {
		if (!options.fields || options.fields.length === 0) {
			options.fields = this.getAvailableFields() as (keyof Model<T>)[];
		}
		return options;
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

	getAvailableFields(extraFields: string[] = []): string[] {
		const model = this.getController().getModel();
		const extraFieldsTyped = extraFields as (keyof Model<T>)[];

		return ([
			...this.getController().getDefaultFields(),
			...this.getController().getSelectetAbleFields(),
			...extraFieldsTyped
		] as (keyof Model<T>)[])
			.filter(
				(field) => !this.getController()
					.getExcludedFields()
					.includes(field as keyof BaseEntity)
			) as string[];

	}

	async findByIdEntity(
		...args: Parameters<BaseController<T>['findByIdEntity']>
	): Promise<OutputData<T>> {
		args[1] = this.setDefaultFields(args[1] || {});
		let result = await this.getController().findByIdEntity(args[0], args[1])
		if (!result) {
			throw new apiError(
				MESSAGES.DATABASE.ENTITY.NOT_FOUND,
				HttpStatus.NOT_FOUND,
				this.getContext()
			)
		}

		if (args[1]?.includes && result) {
			const [hydrated] = await this.loadRelations([result], args[1].includes);
			result = hydrated;
		}

		return this.applyVirtualFields(result);
	}

	async findEntityBy(
		options: QueryFields<BaseEntity>
	): Promise<OutputData<BaseEntity>[]> {
		let typedOptions = this.setDefaultFilters(options as unknown as QueryFields<T>)
		typedOptions = this.setDefaultFields(typedOptions);

		let result = await this.getController().findByEntity(typedOptions) as OutputData<T>[] | undefined
		if (!result) {
			return []
		}

		if (typedOptions.includes && result.length > 0) {
			result = await this.loadRelations(result, typedOptions.includes);
		}

		return this.applyVirtualFields(result) as unknown as OutputData<BaseEntity>[];

	}

	async getMetadata(): Promise<EnhancedTableMetadata> {
		return await this._metadataService.getTableMetadata()
	}

	getModelTable(): ReturnType<BaseController<BaseEntity>['getModelTable']> {
		return this.getController().getModelTable()
	}

	async findAllEntityPaginated(
		...args: Parameters<BaseController<T>['findAllEntityPaginated']>
	): Promise<Awaited<ReturnType<BaseController<BaseEntity>['findAllEntityPaginated']>>> {
		args[0] = this.setDefaultFilters(args[0])
		args[0] = this.setDefaultFields(args[0]);
		const result = await this.getController().findAllEntityPaginated(args[0])

		if (args[0]?.includes && result.data.length > 0) {
			result.data = await this.loadRelations(result.data as unknown as OutputData<T>[], args[0].includes) as unknown as T[];
		}

		result.data = this.applyVirtualFields(result.data as unknown as OutputData<T>[]) as unknown as T[];

		return result
	}

	async findByEntityPaginated(
		...args: Parameters<BaseController<T>['findByEntityPaginated']>
	): Promise<Awaited<ReturnType<BaseController<BaseEntity>['findByEntityPaginated']>>> {
		args[0] = this.setDefaultFilters(args[0])
		args[0] = this.setDefaultFields(args[0]);
		const result = await this.getController().findByEntityPaginated(args[0])
		if (result.data.length === 0) {
			throw new apiError(
				MESSAGES.ERROR.NOT_FOUND,
				HttpStatus.NOT_FOUND,
				this.getContext()
			)
		}

		if (args[0]?.includes && result.data.length > 0) {
			result.data = await this.loadRelations(result.data as unknown as OutputData<T>[], args[0].includes) as unknown as T[];
		}

		result.data = this.applyVirtualFields(result.data as unknown as OutputData<T>[]) as unknown as T[];

		return result
	}

	async createEntity(
		...args: Parameters<BaseController<T>['createEntity']>
	): Promise<Awaited<ReturnType<BaseController<BaseEntity>['createEntity']>>> {

		const result = await this.getController().createEntity(args[0], args[1])
		return this.applyVirtualFields(result as unknown as OutputData<T>);

	}

	async updateEntity(
		...args: Parameters<BaseController<T>['updateEntity']>
	): Promise<Awaited<ReturnType<BaseController<BaseEntity>['updateEntity']>>> {
		const result = await this.getController().updateEntity(args[0], args[1], args[2])
		return this.applyVirtualFields(result as unknown as OutputData<T>);
	}

	async deleteEntity(
		...args: Parameters<BaseController<T>['deleteEntity']>
	): Promise<boolean> {
		const result = await this.withId(args[0]).getController().deleteEntity(args[0])
		if (!result) {
			throw new apiError(
				MESSAGES.ERROR.NOT_FOUND,
				HttpStatus.NOT_FOUND,
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
				HttpStatus.NOT_FOUND,
				this.getContext()
			)
		}
		return result
	}

	async restoreEntity(
		...args: Parameters<BaseController<T>['restoreEntity']>
	): Promise<boolean> {
		const result = await this.withId(args[0]).getController().restoreEntity(args[0])
		if (!result) {
			throw new apiError(
				MESSAGES.ERROR.NOT_FOUND,
				HttpStatus.NOT_FOUND,
				this.getContext()
			)
		}
		return result
	}

	async countAll(
		options: QueryFields<T> = {}
	): Promise<number> {
		return await this.getController().count(options)
	}

	async createMany(
		data: CreateData<T>[],
		options: QueryFields<T> = {}
	): Promise<OutputData<T>[]> {
		const context = this.getContext();
		try {
			const tableMetadata = await this.getMetadata();
			if (tableMetadata) {
				validateSchemaBulk(data, tableMetadata.fields.map((f: { name: string }) => f.name), this.getModelTable());
			}
			const result = await this.getController().createBulkEntity(data, options);
			return this.applyVirtualFields(result);
		} catch (error: unknown) {
			throw ErrorHandler.handleDatabaseError(error, context);
		}
	}

	async updateMany(
		ids: (number | string)[],
		data: UpdateData<T>,
		options: QueryFields<T> = {}
	): Promise<OutputData<T>[]> {
		const context = this.getContext();
		try {
			const tableMetadata = await this.getMetadata();
			if (tableMetadata) {
				validateSchemaBulk([data], tableMetadata.fields.map((f: { name: string }) => f.name), this.getModelTable());
			}
			const result = await this.getController().updateBulkEntity(ids, data, options);
			return this.applyVirtualFields(result);
		} catch (error: unknown) {
			throw ErrorHandler.handleDatabaseError(error, context);
		}
	}

	async deleteMany(
		ids: (number | string)[]
	): Promise<boolean> {
		const context = this.getContext();
		try {
			return await this.getController().deleteBulkEntity(ids);
		} catch (error: unknown) {
			throw ErrorHandler.handleDatabaseError(error, context);
		}
	}

}	