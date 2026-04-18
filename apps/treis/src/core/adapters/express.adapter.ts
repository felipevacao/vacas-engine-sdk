import env from '@libs/env'
import { Request, Response } from 'express'
import { BaseAdapter } from './base.adapter'
import { BaseEntity } from '@interfaces'
import { BaseController } from '@controllers'
import { HateoasTransformer } from '@transformers'
import { ResponseHandler } from '@utils'
import { MESSAGES } from '@constants'
import { UsersRolesService } from '@core-modules/users'
import { BaseServices } from '@services'

export class ExpressAdapter<T extends BaseEntity> extends BaseAdapter<T, Request, Response> {

    hateoas: boolean

    constructor(
        protected service: BaseServices<T, BaseController<T>>
    ) {
        super(service)
        this.hateoas = env.ENABLE_HATEOAS ?? false
    }

    /**
    * Gera os links HATEOAS para uma entidade, com base no nome da tabela e ID.
     */
    protected generateHateoasLinks(
        table: string,
        id: number | undefined
    ): { rel: string; href: string; method: string }[] {

        if (!id) return [];

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
            this.hateoas
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

    }

    /**
     * Busca todas as entidades, com suporte a paginação e filtros.
     */
    async findAll(
        req: Request,
        res: Response
    ): Promise<void> {

        // Valida Input
        const options = this.generateQueryFields(req)
        // Busca entidades
        const result = await this.service.findAllEntityPaginated(options)
        // Estrutura resposta
        result.data = HateoasTransformer.addCollectionLinks(
            result.data,
            (item) =>
                this.generateHateoasLinks(
                    this.service.getModelTable(),
                    item.id as number
                ),
            this.hateoas
        )

        // Retorno de sucesso
        ResponseHandler.paginated(res, result.data, result.pagination)

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

        // Valida Input
        const id = parseInt(req.params.id as string)
        const options = this.generateQueryFields(req)
        // Busca entidade
        const result = await this.service.findByIdEntity(id, options)
        // Retorno Hateoas
        const response = HateoasTransformer.addLinks(
            result,
            this.generateHateoasLinks(
                this.service.getModelTable(),
                result.id as number
            ),
            this.hateoas
        )
        // resposta
        ResponseHandler.success(res, response)

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

        // Valida Input
        const options = this.generateQueryFields(req)
        // Busca entidade
        const result = await this.service.findByEntityPaginated(options)
        // Retorno Hateoas
        result.data = HateoasTransformer.addCollectionLinks(
            result.data,
            (item) => this.generateHateoasLinks(
                this.service.getModelTable(),
                item.id as number
            ),
            this.hateoas
        )
        // resposta
        ResponseHandler.paginated(res, result.data, result.pagination)

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

        // Valida Input
        const id = parseInt(req.params.id as string)
        const data = await this.validateUpdate(id, req)
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
            this.hateoas
        )
        // resposta
        ResponseHandler.success(res, response)

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

        // Valida Input
        const id = parseInt(req.params.id as string)
        if (isNaN(id)) {
            ResponseHandler.error(
                res,
                MESSAGES.DATABASE.ENTITY.INVALID_ID,
                400
            )
            return
        }
        // Valida usuário guest
        const user = await new UsersRolesService(req.session.userId as number).setEntity()
        if (user.isGuest()) {
            ResponseHandler.error(
                res,
                MESSAGES.DATABASE.ENTITY.DELETE_ERROR,
                401
            )
            return
        }
        // Deleta entidade
        const success = await this.service.deleteEntity(id)
        // Resposta de sucesso
        ResponseHandler.success(
            res,
            { deleted: success },
            MESSAGES.DATABASE.ENTITY.DELETED,
            204
        )

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

        // Valida Input
        const { id } = req.params
        const numericId = Number(id)
        if (isNaN(numericId)) {
            ResponseHandler.error(
                res,
                MESSAGES.DATABASE.ENTITY.INVALID_ID,
                400
            )
            return
        }
        // Valida usuário admin
        const user = await new UsersRolesService(req.session.userId as number).setEntity()
        if (user.isAdmin()) {
            ResponseHandler.error(
                res,
                MESSAGES.DATABASE.ENTITY.DELETE_ERROR,
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
                404
            );
            return;
        }
        ResponseHandler.success(res, metadata);
    }
}