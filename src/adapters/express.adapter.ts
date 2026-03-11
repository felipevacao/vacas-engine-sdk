import { Request, Response } from 'express'
import { BaseAdapter } from './base.adapter'
import { BaseEntity } from 'types/entity'
import { BaseController } from '@controllers/baseController'
import { HateoasTransformer } from '@transformers/hateoas.transformer'
import { ResponseHandler } from '@utils/responseHandler'
import { MESSAGES } from '@constants/messages'
import { UsersController } from '@dynamic-modules/controllers/users'

export class ExpressAdapter<T extends BaseEntity> extends BaseAdapter<T, Request, Response> {
    constructor(protected service: BaseController<T>) {
        super(service)
    }

    /**
    * Gera os links HATEOAS para uma entidade, com base no nome da tabela e ID.
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

    protected getResourceUrl(req: Request, id: number | string | undefined): string {
        // Remove versão da API se existir (opcional)
        const basePath = req.baseUrl;
        
        // Se a rota termina com '/', remove
        const cleanPath = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath;
        
        // Remove 'create' ou 'novo' se estiver na URL (dependendo da sua rota)
        const resourcePath = cleanPath.replace(/\/?(create|new|\/)?$/, '');
        
        return `${resourcePath}/${id}`;
    }

    /**
     * Cria uma nova entidade.
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
            // Estrutura resposta 
            const response = HateoasTransformer.addLinks(
                result,
                this.generateHateoasLinks(
                    this.service.getModelTable(),
                    result.id as number
                ),
                options.links
            )

            const resourceUrl = this.getResourceUrl(req, result.id);

            // Retorno de sucesso
            ResponseHandler.success(
                res,
                response,
                MESSAGES.DATABASE.ENTITY.CREATED,
                201,
                { 'Location': resourceUrl }
            )

        } catch (error) {

            ResponseHandler.error(
                res,
                MESSAGES.DATABASE.ENTITY.CREATED_ERROR,
                MESSAGES.ERROR.INTERNAL_ERROR,
                500,
                error
            )

        }

    }

    /**
     * Busca todas as entidades, com suporte a paginação e filtros.
     */
    async findAll(
        req: Request,
        res: Response
    ): Promise<void> {

        try {

            // Valida Input
            const options = this.generateQueryFields(req)
            // Busca entidades
            const result = await this.service.findAllEntityPaginated(options)
            // Estrutura resposta
            result.data = HateoasTransformer.addCollectionLinks(
                result.data,
                (item) => this.generateHateoasLinks(
                    this.service.getModelTable(),
                    item.id as number
                ),
                options.links
            )

            // Retorno de sucesso
            ResponseHandler.paginated(res, result.data, result.pagination)

        } catch (error) {

            ResponseHandler.error(
                res,
                MESSAGES.DATABASE.ENTITY.READ_ERROR,
                MESSAGES.ERROR.INTERNAL_ERROR,
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
                    MESSAGES.ERROR.NOT_FOUND,
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
                MESSAGES.DATABASE.ENTITY.READ_ERROR,
                MESSAGES.ERROR.INTERNAL_ERROR,
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
            const result = await this.service.findByEntityPaginated(options)
            if (result.data.length === 0) {
                ResponseHandler.error(
                    res,
                    '',
                    MESSAGES.ERROR.NOT_FOUND,
                    404
                )
                return
            }
            // Retorno Hateoas
            result.data = HateoasTransformer.addCollectionLinks(
                result.data,
                (item) => this.generateHateoasLinks(
                    this.service.getModelTable(),
                    item.id as number
                ),
                options.links || false
            )

            // resposta
            ResponseHandler.paginated(res, result.data, result.pagination)

        } catch (error) {
            ResponseHandler.error(
                res,
                MESSAGES.DATABASE.ENTITY.READ_ERROR,
                MESSAGES.ERROR.INTERNAL_ERROR,
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
                    MESSAGES.DATABASE.ENTITY.INVALID_ID,
                    MESSAGES.ERROR.INVALID_FORMAT,
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
                MESSAGES.DATABASE.ENTITY.UPDATE_ERROR,
                MESSAGES.ERROR.INTERNAL_ERROR,
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
                    MESSAGES.DATABASE.ENTITY.INVALID_ID,
                    MESSAGES.ERROR.INVALID_FORMAT,
                    400
                )
                return
            }
            // Valida usuário guest
            const user = await (new UsersController()).findByIdEntity(req.session.userId as number)
            if (!user || user.role === 'guest') {
                ResponseHandler.error(
                    res,
                    MESSAGES.DATABASE.ENTITY.DELETE_ERROR,
                    MESSAGES.ERROR.UNAUTHORIZED,
                    401
                )
                return
            }
            // Deleta entidade
            const success = await this.service.deleteEntity(id)
            if (!success) {
                ResponseHandler.error(
                    res,
                    MESSAGES.DATABASE.ENTITY.NOT_FOUND,
                    MESSAGES.ERROR.NOT_FOUND,
                    404
                )
                return
            }
            // Resposta de sucesso
            ResponseHandler.success(
                res,
                {},
                MESSAGES.DATABASE.ENTITY.DELETED,
                204
            )

        } catch (error) {
            ResponseHandler.error(
                res,
                MESSAGES.DATABASE.ENTITY.DELETED,
                MESSAGES.ERROR.INTERNAL_ERROR,
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
                    MESSAGES.DATABASE.ENTITY.INVALID_ID,
                    MESSAGES.ERROR.INVALID_FORMAT,
                    400
                )
                return
            }
            // Valida usuário admin
            const user = await (new UsersController()).findByIdEntity(req.session.userId as number)
            if (!user || user.role !== 'admin') {
                ResponseHandler.error(
                    res,
                    MESSAGES.DATABASE.ENTITY.DELETE_ERROR,
                    MESSAGES.ERROR.UNAUTHORIZED,
                    401
                )
                return
            }
            // Deleta entidade
            const success = await this.service.forceDeleteEntity(numericId)
            if (!success) {
                ResponseHandler.error(
                    res,
                    MESSAGES.DATABASE.ENTITY.NOT_FOUND,
                    MESSAGES.ERROR.NOT_FOUND,
                    404
                )
                return
            }
            // Resposta de sucesso
            ResponseHandler.success(
                res,
                {},
                MESSAGES.DATABASE.ENTITY.DELETED,
                204
            )

        } catch (error) {
            ResponseHandler.error(
                res,
                MESSAGES.DATABASE.ENTITY.DELETE_ERROR,
                MESSAGES.ERROR.INTERNAL_ERROR,
                500,
                error as Error
            )
        }
    }

    async metadata(
        req: Request,
        res: Response
    ): Promise<void> {
        const metadata = await this.service.getMetadata();
        if (!metadata) {
            ResponseHandler.error(
                res,
                MESSAGES.DATABASE.ENTITY.METADATA_NOT_FOUND,
                MESSAGES.ERROR.NOT_FOUND,
                404
            );
            return;
        }
        ResponseHandler.success(res, metadata);
    }
}