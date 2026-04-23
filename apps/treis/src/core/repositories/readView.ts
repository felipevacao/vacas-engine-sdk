import { ErrorContext, OutputData, QueryFields } from '@app-types'
import { BaseView, PaginatedResult } from '@interfaces'
import { db, ErrorHandler, applyFilters } from '@utils'
import env from '@libs/env'

/**
 * Operações de leitura para entidades, incluindo métodos para buscar todos os registros, buscar por ID, buscar por critérios específicos e realizar consultas paginadas.
 */
export const readView = <T extends BaseView>(table: string) => {

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
        return result || { data: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0, hasNext: false, hasPrev: false } }

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

    const count = async (
        options: QueryFields<T> = {}
    ): Promise<number> => {
        const context = {} as ErrorContext
        context.entity = table

        try {
            const query = db(table)
                .where(options.where || {})
                .whereNull('deletedAt')
                .count('* as count')
                .first();

            applyFilters(query, options);

            const result = await query as { count: string | number } | undefined;
            return result ? parseInt(String(result.count)) : 0;
        } catch (error) {
            throw ErrorHandler.handleDatabaseError(error, context);
        }
    }

    /**
     * Gerador de consultas para operações de leitura.
     */
    const queryGenerator = async (
        options: QueryFields<T>
    ): Promise<OutputData<T>[] | undefined> => {

        const context = {} as ErrorContext
        context.entity = table

        try {
            const query = db<T>(table)
                .select(options.fields || '*')
                .where(options.where || {})

            applyFilters(query, options);

            query
                .limit(options.limit || 10)
                .offset(options.offset || 0)
                .orderBy(options.orderBy || 'id', options.order || 'asc');

            if (env.NODE_ENV === 'development') {
                context.details = [query.toQuery()]
            }

            const result = await query;
            return result as unknown as OutputData<T>[];
        } catch (error) {
            throw ErrorHandler.handleDatabaseError(error, context);
        }
    }

    /**
     * Gerador de consultas paginadas para operações de leitura.
     */
    const queryGeneratorPaginated = async (
        options: QueryFields<T>
    ): Promise<PaginatedResult<T>> => {
        const context = {} as ErrorContext
        context.entity = table
        try {
            const query = db<T>(table)
                .select(options.fields || '*')
                .where(options.where || {})

            applyFilters(query, options);

            const orderBy = options.orderBy || 'id';
            const order = options.order || 'asc';

            query.orderBy(orderBy, order);

            // Configurar paginação
            const currentPage = options.page || 1;
            const pageSize = options.limit || 10;
            const skipRecords = options.offset ?? (currentPage - 1) * pageSize;

            query
                .limit(pageSize)
                .offset(skipRecords);

            const countQuery = db(table)
                .where(options.where || {})
                .count('* as count')
                .first();

            applyFilters(countQuery, options);

            if (env.NODE_ENV === 'development') {
                context.details = [query.toQuery(), countQuery.toQuery()]
            }

            const [result, totalCount] = await Promise.all([
                query,
                countQuery as Promise<{ count: string | number } | undefined>
            ]);

            const total = totalCount ? parseInt(String(totalCount.count)) : 0;

            const newUrl = options.originalUrl?.replace(`&page=${currentPage}`, '').replace(`page=${currentPage}`, '') || '';
            let urlChar = '&';
            if (!newUrl.includes('?')) {
                urlChar = '?';
            }
            const nextPage = skipRecords + pageSize < total ? currentPage + 1 : null;
            const prevPage = skipRecords > 0 ? currentPage - 1 : null;
            const nextPageUrl = nextPage ? newUrl + urlChar + `page=${nextPage}` : null;
            const prevPageUrl = prevPage ? newUrl + urlChar + `page=${prevPage}` : null;

            return {
                data: result as T[],
                pagination: {
                    page: Math.floor(skipRecords / pageSize) + 1,
                    limit: pageSize,
                    total: total,
                    totalPages: Math.ceil(total / pageSize),
                    hasNext: skipRecords + pageSize < total,
                    hasPrev: skipRecords > 0,
                    nextPageUrl,
                    prevPageUrl,
                }
            };
        } catch (error) {
            throw ErrorHandler.handleDatabaseError(error, context);
        }

    }

    return { findAll, findBy, findByPaginated, findAllPaginated, count }

}
