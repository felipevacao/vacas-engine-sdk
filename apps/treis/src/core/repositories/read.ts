import { db } from '@utils/db'
import { BaseEntity, ErrorContext, OutputData, PaginatedResult, QueryFields } from '@app-types/entity'
import { ErrorHandler } from '@utils/ErrorHandler'
import { env } from 'process'

/**
 * Operações de leitura para entidades, incluindo métodos para buscar todos os registros, buscar por ID, buscar por critérios específicos e realizar consultas paginadas.
 */
export const read = <T extends BaseEntity>(table: string) => {

    const findAll = async (
        options: QueryFields<T> = {}
    ): Promise<OutputData<T>[]> => {

        const result = await queryGenerator({
            fields: options.fields,
            limit: options.limit || 10,
            offset: options.offset || 0,
            orderBy: options.orderBy || 'id',
            order: options.order || 'asc',
            filters: options.filters
        })
        return result || []

    }

    const findAllPaginated = async (
        options: QueryFields<T> = {}
    ): Promise<PaginatedResult<T>> => {

        const result = await queryGeneratorPaginated(options)
        return result || []

    }

    const findById = async (
        id: number | string,
        options: QueryFields<T> = {}
    ): Promise<OutputData<T> | undefined> => {

        const result = await queryGenerator({
            fields: options.fields,
            where: { id: id } as Partial<T>,
            limit: 1,
            offset: 0,
            orderBy: options.orderBy || 'id',
            order: options.order || 'asc',
            filters: options.filters
        })

        return result ? result[0] : undefined
    }

    const findBy = async (
        options: QueryFields<T>
    ): Promise<OutputData<T>[] | undefined> => {

        return await queryGenerator(options)

    }

    const findByPaginated = async (
        options: QueryFields<T>
    ): Promise<PaginatedResult<T>> => {

        return await queryGeneratorPaginated(options)

    }

    /**
     * Gerador de consultas para operações de leitura, permitindo a construção dinâmica de queries com base em diversos parâmetros, 
     * como campos selecionados, filtros, ordenação e paginação. Essa função centraliza a lógica de consulta, 
     * facilitando a reutilização e manutenção do código, além de garantir consistência nas operações de leitura em toda a aplicação.
     */
    const queryGenerator = async (
        options: QueryFields<T>
    ): Promise<OutputData<T>[] | undefined> => {

        const context = {} as ErrorContext
        context.entity = table

        try {
            let query = db(table)
                .select(options.fields || '*')
                .where(options.where || {})

            if (options.filters) {
                options.filters.forEach(filter => {
                    query = query.where(filter.field, filter.operator, filter.value);
                });
            }

            query = query
                .limit(options.limit || 10)
                .offset(options.offset || 0)
                .orderBy(options.orderBy || 'id', options.order || 'asc')
                .whereNull('deletedAt')

            if (env.NODE_ENV === 'development') {
                context.details = [query.toQuery()]
            }
            return query
        } catch (error) {
            throw ErrorHandler.handleDatabaseError(error, context);
        }
    }

    /**
     * Gerador de consultas paginadas para operações de leitura, permitindo a construção dinâmica de queries com suporte a paginação,
     * além de incluir informações de navegação, como URLs para as próximas e anteriores páginas. Essa função centraliza a lógica de consulta paginada,
     * facilitando a reutilização e manutenção do código, além de garantir consistência nas operações de leitura paginada em toda a aplicação.
     */
    const queryGeneratorPaginated = async (
        options: QueryFields<T>
    ): Promise<PaginatedResult<T>> => {
        const context = {} as ErrorContext
        context.entity = table
        try {
            let query = db(table)
                .select(options.fields || '*')
                .where(options.where || {})

            if (options.filters) {
                options.filters.forEach(filter => {
                    query = query.where(filter.field, filter.operator, filter.value);
                });
            }

            query = query
                .orderBy(options.orderBy || 'id', options.order || 'asc')
                .whereNull('deletedAt')

            // Configurar paginação
            const currentPage = options.page || 1;
            const pageSize = options.limit || 10;
            const skipRecords = options.offset ?? (currentPage - 1) * pageSize;

            query = query
                .limit(pageSize)
                .offset(skipRecords);

            let countQuery = db(table)
                .where(options.where || {})
                .count('* as count')
                .whereNull('deletedAt')
                .first();
            if (options.filters) {
                options.filters.forEach(filter => {
                    countQuery = countQuery.where(filter.field, filter.operator, filter.value);
                });
            }
            if (env.NODE_ENV === 'development') {
                context.details = [query.toQuery(), countQuery.toQuery()]
            }

            const [result, totalCount] = await Promise.all([
                query,
                countQuery
            ]);

            const total = totalCount ? parseInt(totalCount.count as string) : 0 as number;

            const newUrl = options.originalUrl?.replace(`&page=${currentPage}`, '').replace(`page=${currentPage}`, '') as string || '';
            let urlChar = '&';
            if (!newUrl.includes('?')) {
                urlChar = '?';
            }
            const nextPage = (skipRecords || 0) + (options.limit || 10) < total ? currentPage + 1 : null;
            const prevPage = (skipRecords || 0) > 0 ? currentPage - 1 : null;
            const nextPageUrl = nextPage ? newUrl + urlChar + `page=${nextPage}` : null;
            const prevPageUrl = prevPage ? newUrl + urlChar + `page=${prevPage}` : null;

            return {
                data: result as OutputData<T>[] ?? [],
                pagination: {
                    page: Math.floor((skipRecords || 0) / (options.limit || 10)) + 1,
                    limit: options.limit || 10,
                    total: total,
                    totalPages: Math.ceil(total / (options.limit || 10)),
                    hasNext: (skipRecords || 0) + (options.limit || 10) < total,
                    hasPrev: (skipRecords || 0) > 0,
                    nextPageUrl,
                    prevPageUrl,
                }
            } as PaginatedResult<T>;
        } catch (error) {
            throw ErrorHandler.handleDatabaseError(error, context);
        }

    }

    return { findAll, findById, findBy, findByPaginated, findAllPaginated }

}
