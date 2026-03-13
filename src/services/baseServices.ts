import { MESSAGES } from "@constants/messages";
import { BaseController } from "@controllers/baseController";
import { apiError } from "@utils/error";
import { BaseEntity, OutputData, ErrorContext } from 'types/entity'
import { ErrorService } from "./erro";

export class BaseServices {
	
	private entity: OutputData<BaseEntity> | null = null
	private id: number = 0

	constructor(
		private entityController: BaseController<BaseEntity>,
		private errorService: ErrorService
	) { 
		this.context({entity: this.entityController.getModelTable()})
	}

	protected validateId(id: number): asserts id is number {
		if (!id || typeof id !== 'number' || id <= 0 || !Number.isInteger(id) || id == 0) {
			throw new apiError(
				MESSAGES.DATABASE.ENTITY.INVALID_ID,
				400,
				this.getContext()
			)
		}
	}

	/**
	 * Adiciona contextos para serem repassados no Erro
	 * @param metadata 
	 */
	context(metadata: Partial<ErrorContext>): this {
		this.errorService.setErrorMetadata(metadata)
		return this
	}

	/**
	 * Reserva o Id da entidade
	 * @param id 
	 * @returns 
	 */
	withId(id: number): this {
		this.validateId(id)
		this.context({ id })
		this.id = id
		return this
	}

	getContext() {
		return this.errorService.getErrorContext()
	}

	async getEntity() {
		this.entity = await this.entityController.findByIdEntity(this.id)
		if (!this.entity) {
			throw new apiError(MESSAGES.DATABASE.ENTITY.NOT_FOUND, 404, this.getContext())
		}
		return this.entity
	}
}