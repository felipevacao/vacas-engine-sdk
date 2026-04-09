import { MESSAGES } from "@constants/messages";
import { BaseController } from "@controllers/baseController";
import { BaseServices } from "@services/baseServices";
import { apiError } from "@utils/error";
import { BaseEntity, CreateData, IAdapter, InputRequest, QueryFields, Model, UpdateData } from "@app-types/entity";
import { asyncHandler, AsyncHandlerFn } from "@utils/asyncHandler";

export abstract class BaseAdapter<T extends BaseEntity, V, U> implements IAdapter<V, U> {
    constructor(
        protected service: BaseServices<T, BaseController<T>>
    ) {
        this.service = service;
        this.wrapMethods();
    }

    /**
     * Envolve todos os métodos públicos da classe com asyncHandler
     * e faz o bind automático do 'this'.
     */
    // private wrapMethods() {
    //     let currentProto = Object.getPrototypeOf(this);

    //     // Percorre a cadeia de protótipos até chegar no BaseAdapter
    //     while (currentProto && currentProto.constructor !== Object) {
    //         const methods = Object.getOwnPropertyNames(currentProto) as (keyof this)[];

    //         methods.forEach((method) => {
    //             const member = this[method];
    //             // Evita envolver o mesmo método duas vezes (se sobrescrito)
    //             const isAlreadyWrapped = Object.prototype.hasOwnProperty.call(this, method);

    //             if (
    //                 !isAlreadyWrapped &&
    //                 method !== 'constructor' &&
    //                 typeof member === 'function' &&
    //                 !String(method).startsWith('_') &&
    //                 !['validateCreate', 'validateUpdate', 'generateQueryFields', 'parseFilter', 'wrapMethods'].includes(String(method))
    //             ) {
    //                 const boundMethod = (member as (...args: never[]) => Promise<unknown>).bind(this);
    //                 (this as Record<keyof this, unknown>)[method] = asyncHandler(boundMethod as unknown as AsyncHandlerFn);
    //             }
    //         });

    //         currentProto = Object.getPrototypeOf(currentProto);
    //         // Para se chegarmos no BaseAdapter (não precisamos envolver métodos do próprio BaseAdapter)
    //         if (currentProto && currentProto.constructor === BaseAdapter) break;
    //     }
    // }

    private wrapMethods() {
        const proto = Object.getPrototypeOf(this);
        const methodNames = Object.getOwnPropertyNames(proto);

        methodNames.forEach((method) => {
            const descriptor = Object.getOwnPropertyDescriptor(proto, method);

            if (
                method !== 'constructor' &&
                typeof descriptor?.value === 'function' &&
                !method.startsWith('_') &&
                !['validateCreate', 'validateUpdate', 'generateQueryFields', 'parseFilter'].includes(method)
            ) {
                const originalMethod = descriptor.value;

                // Re-define o método usando um Proxy para manter o contexto 'this' intacto
                Object.defineProperty(this, method, {
                    value: asyncHandler(originalMethod.bind(this)),
                    writable: true,
                    configurable: true,
                    enumerable: true

                });

            }

        });
    }

    abstract create(input: V, output: U): Promise<void>;
    abstract findAll(input: V, output: U): Promise<void>;
    abstract findById(input: V, output: U): Promise<void>;
    abstract findBy(input: V, output: U): Promise<void>;
    abstract update(input: V, output: U): Promise<void>;
    abstract delete(input: V, output: U): Promise<void>;
    abstract forceDelete(input: V, output: U): Promise<void>;
    abstract metadata(input: V, output: U): Promise<void>;

    /**
     * Valida o input para criação de uma nova entidade.
     * @param input O input contendo os dados da entidade a ser criada.
     * @returns Os dados validados para criação da entidade.
     */
    protected async validateCreate(
        input: InputRequest<V>
    ): Promise<CreateData<T>> {

        return await this.service.generateBodyCreate(input) ?? input.body as CreateData<T>;

    }

    /**
     * Valida o input para atualização de uma entidade existente.
     * @param input O input contendo os dados da entidade a ser atualizada.
     * @returns Os dados validados para atualização da entidade.
     */
    protected async validateUpdate(
        id: number,
        input: InputRequest<V>
    ): Promise<UpdateData<T>> {

        return await this.service.withId(id).generateBodyUpdate(input) ?? input.body as UpdateData<T>;

    }

    /**
     * Gera os campos de consulta a partir do input, incluindo filtros, ordenação e paginação.
     */
    protected generateQueryFields(
        input: InputRequest<V>
    ): QueryFields<T> {

        const extraFields = input.query.fields ? (input.query.fields as string).split(',') as (keyof Model<T>)[] : [];
        const fields = this.service.getAvailableFields(extraFields) as (keyof Model<T>)[];
        const where = input.query.where as Partial<T> ?? {};

        const inputFilter = input.query.filter ?? [];
        const filters = Array.isArray(inputFilter) ? inputFilter.length > 0 ? inputFilter.map((filter) => this.parseFilter(filter)) : [] : [this.parseFilter(inputFilter)];

        const limit = input.query.limit ? parseInt(input.query.limit as unknown as string) : undefined;

        return {
            originalUrl: input.originalUrl as string ?? '',
            links: input.query.links == 'true' ? true : false,
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

    /**
     * Analisa uma string de filtro e extrai o campo, operador e valor.
     */
    protected parseFilter = (filterString: string): {
        field: string
        operator: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'LIKE' | 'IN' | 'BETWEEN'
        value: string
    } => {

        // Regex para capturar field, operator e value
        const regex = /^([a-zA-Z_][a-zA-Z0-9_]*)\s*(==|!=|>=|<=|>|<|~)\s*(.+)$/;
        const match = filterString.match(regex);

        if (!match) {
            throw new apiError(MESSAGES.ERROR.INVALID_FILTER_FORMAT, 500);
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