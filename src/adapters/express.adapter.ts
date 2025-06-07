import { Request, Response } from 'express'
import { BaseAdapter } from './base.adapter'
import { BaseEntity } from 'types/entity'
import { BaseController } from '@controllers/baseController'
import { HateoasTransformer } from '@transformers/hateoas.transformer'
import { ResponseHandler } from '@utils/responseHandler'
import { ERROR_CODES } from '@constants/errorCodes'

export class ExpressAdapter<T extends BaseEntity> extends BaseAdapter<T, Request, Response> {
    constructor(protected service: BaseController<T>){
        super(service)
    }    
    
    /**
     * Generates HATEOAS links for a specific entity.
     * @param table The name of the table (model) the entity belongs to.
     * @param id The ID of the entity.
     * @returns An array of HATEOAS links for the entity.
     */
    protected generateHateoasLinks(
        table: string, 
        id: number | undefined
        ): { rel: string; href: string; method: string }[] {

            return [
                { rel: "self", href: `/${table}/${id}`, method: "GET" },
                { rel: "update", href: `/${table}/${id}`, method: "PUT" },
                { rel: "delete", href: `/${table}/${id}`, method: "DELETE" },
            ]

    }

    /**
     * Creates a new entity.
     * @param req The request object containing the entity data.
     * @param res The response object to send the result.
     */
    async create(
        req: Request, 
        res: Response
        ): Promise<void> {

            try {
                // Valida Input
                const options = this.generateQueryFields(req)
                const data = await this.validateCreate(req)
                // Cria entidade
                const result = await this.service.createEntity(data, options)
                // Retorno
                const response = HateoasTransformer.addLinks(
                                    result, 
                                    this.generateHateoasLinks(
                                        this.service.getModelTable(), 
                                        result.id as number
                                    ), 
                                    options.links
                                )

                ResponseHandler.success(
                    res, 
                    response, 
                    'Usuário criado com sucesso', 
                    201
                )
            } catch (error) {
                ResponseHandler.error(
                    res, 
                    'Error creating entity', 
                    ERROR_CODES.INTERNAL_ERROR, 
                    500, 
                    error
                )
            }

    }

    /**
     * Retrieves all entities.
     * @param req The request object containing query parameters.
     * @param res The response object to send the result.
     */
    async findAll(
        req: Request, 
        res: Response
        ): Promise<void> {

            try {
                // Valida Input
                const options = this.generateQueryFields(req)
                // Busca entidades
                const result = await this.service.findAllEntity(options)
                // Retorno Hateoas
                const response = HateoasTransformer.addCollectionLinks(
                    result, 
                    (item) => this.generateHateoasLinks(
                            this.service.getModelTable(), 
                            item.id as number
                        ), 
                    options.links
                )
                // resposta
                ResponseHandler.success(res, response)
            } catch (error) {
                ResponseHandler.error(
                    res, 
                    'Error fetching entities', 
                    ERROR_CODES.INTERNAL_ERROR, 
                    500, 
                    error
                )
            }

    }  

    /**
     * Finds an entity by its ID.
     * @param req The request object containing the entity ID.
     * @param res The response object to send the result.
     */
    async findById(
        req: Request, 
        res: Response
        ): Promise<void> {
            
            try {
                // Valida Input
                const id = parseInt(req.params.id)
                const options = this.generateQueryFields(req)
                // Busca entidade
                const result = await this.service.findByIdEntity(id, options)

                if (!result) {
                    ResponseHandler.error(
                        res,
                        '',
                        ERROR_CODES.NOT_FOUND,
                        404
                    )
                    return
                } 
                // Retorno Hateoas
                const response = HateoasTransformer.addLinks(
                    result, 
                    this.generateHateoasLinks(
                        this.service.getModelTable(), 
                        result.id as number
                    ), 
                    options.links
                )
                
                // resposta
                ResponseHandler.success(res, response)
                
            } catch (error) {
                ResponseHandler.error(
                    res,
                    'Error fetching entity',
                    ERROR_CODES.INTERNAL_ERROR,
                    500,
                    error as Error
                )
            }

    }

    /**
     * Finds entities by specific fields.
     * @param req The request object containing query parameters.
     * @param res The response object to send the result.
     */
    async findBy(
        req: Request, 
        res: Response
        ): Promise<void> {

            try {
                // Valida Input
                const options = this.generateQueryFields(req)
                // Busca entidade
                const result = await this.service.findByEntity(options)
                if (result.length === 0) {
                    ResponseHandler.error(
                        res,
                        '',
                        ERROR_CODES.NOT_FOUND,
                        404
                        )
                    return
                }
                // Retorno Hateoas
                const response = HateoasTransformer.addCollectionLinks(
                    result, 
                    (item) => this.generateHateoasLinks(
                        this.service.getModelTable(), 
                        item.id as number
                    ), 
                    options.links || false
                )
                
                // resposta
                ResponseHandler.success(res, response)
                
            } catch (error) {
                ResponseHandler.error(
                    res,
                    'Error fetching entity',
                    ERROR_CODES.INTERNAL_ERROR,
                    500,
                    error as Error
                )
            }

    }

    /**
     * Updates an existing entity.
     * @param req The request object containing the entity ID and update data.
     * @param res The response object to send the result.
     */
    async update(
        req: Request, 
        res: Response
        ): Promise<void> {

            try {
                // Valida Input
                const id = parseInt(req.params.id)
                const data = await this.validateUpdate(req)
                if (isNaN(id)) {
                    ResponseHandler.error(
                        res,
                        'Invalid ID format',
                        ERROR_CODES.INVALID_FORMAT,
                        400
                    )
                    return
                }
                const options = this.generateQueryFields(req)
                // Atualiza entidade
                const result = await this.service.updateEntity(id, data, options)
                // Retorno Hateoas
                const response = HateoasTransformer.addLinks(
                                    result, 
                                    this.generateHateoasLinks(
                                        this.service.getModelTable(), 
                                        result.id as number
                                    ), 
                                    options.links
                                )
                // resposta
                ResponseHandler.success(res, response)
            } catch (error) {
                ResponseHandler.error(
                        res,
                        'Error updating entity',
                        ERROR_CODES.INTERNAL_ERROR,
                        500,
                        error as Error
                    )
            }

    }

    /**
     * Deletes an entity by its ID.
     * @param req The request object containing the entity ID.
     * @param res The response object to send the result.
     */
    async delete(
        req: Request, 
        res: Response
        ): Promise<void> {

            try {
                // Valida Input
                const id = parseInt(req.params.id)
                if (isNaN(id)) {
                    ResponseHandler.error(
                        res,
                        'Invalid ID format',
                        ERROR_CODES.INVALID_FORMAT,
                        400
                    )
                    return
                }

                // Deleta entidade
                const success = await this.service.deleteEntity(id)
                if (!success) {
                    ResponseHandler.error(
                        res,
                        'Entity not found',
                        ERROR_CODES.NOT_FOUND,
                        404
                    )
                    return
                }
                // Resposta de sucesso
                ResponseHandler.success(
                    res, 
                    {}, 
                    'Entity deleted successfully', 
                    204
                )

            } catch (error) {
                ResponseHandler.error(
                        res,
                        'Error deleting entity',
                        ERROR_CODES.INTERNAL_ERROR,
                        500,
                        error as Error
                    )
            }
    }

    /**
     * Force deletes an entity by its ID.
     * @param req The request object containing the entity ID.
     * @param res The response object to send the result.
     */
    async forceDelete(
        req: Request, 
        res: Response
        ): Promise<void> {

            try {
                // Valida Input
                const { id } = req.params
                const numericId = Number(id)
                if (isNaN(numericId)) {
                    ResponseHandler.error(
                        res,
                        'Invalid ID format',
                        ERROR_CODES.INVALID_FORMAT,
                        400
                    )
                    return
                }
                // Deleta entidade
                const success = await this.service.forceDeleteEntity(numericId)
                if (!success) {
                    ResponseHandler.error(
                        res,
                        'Entity not found',
                        ERROR_CODES.NOT_FOUND,
                        404
                    )
                    return
                }
                // Resposta de sucesso
                ResponseHandler.success(
                    res, 
                    {}, 
                    'Entity deleted successfully', 
                    204
                )

            } catch (error) {
                ResponseHandler.error(
                        res,
                        'Error deleting entity',
                        ERROR_CODES.INTERNAL_ERROR,
                        500,
                        error as Error
                    )
            }
    }
}