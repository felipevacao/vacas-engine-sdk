import { BaseController } from "@controllers/baseController";
import { BaseEntity, CreateData, IAdapter, InputRequest, QueryFields, Model, UpdateData } from "types/entity";

export abstract class BaseAdapter<T extends BaseEntity, V, U> implements IAdapter<V, U> {
    constructor(protected service: BaseController<T>) {
        this.service = service;
    }

    abstract create     (input: V, output: U): Promise<void>;
    abstract findAll    (input: V, output: U): Promise<void>;
    abstract findById   (input: V, output: U): Promise<void>;
    abstract findBy     (input: V, output: U): Promise<void>;
    abstract update     (input: V, output: U): Promise<void>;
    abstract delete     (input: V, output: U): Promise<void>;
    abstract forceDelete(input: V, output: U): Promise<void>;
    abstract metadata   (input: V, output: U): Promise<void>;

    /**
     * Validates the input for creating a new entity.
     * @param input The input request containing the entity data.
     * @returns The validated create data for the entity.
     */
    protected async validateCreate(
        input: InputRequest<V>
    ): Promise<CreateData<T>> {

        return await this.service.generateBodyCreate(input) ?? input.body as CreateData<T>;

    }

    /**
     * Validates the input for updating an existing entity.
     * @param input The input request containing the entity data.
     * @returns The validated update data for the entity.
     */
    protected async validateUpdate(
        input: InputRequest<V>
    ): Promise<UpdateData<T>> {

        return await this.service.generateBodyUpdate(input) ?? input.body as UpdateData<T>;
        
    }
    
    /**
     * Generates the query fields for the model based on the input request.
     * @param input The input request containing query parameters.
     * @returns The query fields for the model.
     */
    protected generateQueryFields(
        input: InputRequest<V>
    ): QueryFields<T> {

        const extraFields = input.query.fields ? (input.query.fields as string).split(',') as (keyof Model<T>)[] : [];
        const fields = this.service.getAvailableFields(extraFields) as (keyof Model<T>)[];
        const where = input.query.where as Partial<T> ?? [];

        const inputFilter = input.query.filter ?? [];
        const filters = Array.isArray(inputFilter) ? inputFilter.length > 0 ? inputFilter.map((filter) => this.parseFilter(filter)) : [] : [this.parseFilter(inputFilter)];

        const limit = input.query.limit ? parseInt(input.query.limit as unknown as string) : undefined;

        return {
            originalUrl: input.originalUrl as string ?? '',
            links: input.query.links ? ( input.query.links == 'true' ? true : false ) : this.service.hateoas,
            fields,
            where,
            filters,
            limit: limit,
            offset: input.query.offset ? parseInt(input.query.offset as unknown as string) : undefined,
            orderBy: input.query.orderBy as string ?? 'id',
            order: input.query.order as string ?? 'asc',
            page: input.query.page ? parseInt(input.query.page as unknown as string) : undefined,
            pageSize: input.query.pageSize ? parseInt(input.query.pageSize as unknown as string) : undefined
        }
 
    }

    protected parseFilter = (filterString: string): {
        field: string
        operator: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'LIKE' | 'IN' | 'BETWEEN'
        value: string
    } => {

        // Regex para capturar field, operator e value
        const regex = /^([a-zA-Z_][a-zA-Z0-9_]*)\s*(==|!=|>=|<=|>|<|~)\s*(.+)$/;
        const match = filterString.match(regex);
        
        if (!match) {
            throw new Error('Invalid filter format');
        }
        
        const [, field, operator, value] = match;
        
        // Mapear operadores para Knex
        const operatorMap: Record<string, '=' | '!=' | '>' | '<' | '>=' | '<=' | 'LIKE' | 'IN' | 'BETWEEN'> = {
            '==': '=',
            '!=': '!=',
            '>': '>',
            '<': '<',
            '>=': '>=',
            '<=': '<=',
            '~': 'LIKE',
            'IN': 'IN',
            'BETWEEN': 'BETWEEN'
        };
        
        return {
            field,
            operator: operatorMap[operator],
            value: value.replace(/^['"]|['"]$/g, '') // Remove aspas se houver
        };
    };

}