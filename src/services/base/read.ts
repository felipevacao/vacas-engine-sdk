import { db } from '@utils/db'
import { BaseEntity, OutputData, PaginatedResult, QueryFields } from 'types/entity'

export const read = <T extends BaseEntity>(table: string) => {

    const queryGenerator = async (
        options: QueryFields<T>
    ): Promise<OutputData<T>[] | undefined> => {

        let query = db(table)
                .select(options.fields || '*')
                .where(options.where || {})

        if (options.whereSign) {
            query = query.where(options.whereSign.field, options.whereSign.sign, options.whereSign.value);
        }
        
        query = query
            .limit(options.limit || 10)
            .offset(options.offset || 0)
            .orderBy(options.orderBy || 'id', options.order || 'asc')
            .whereNull('deletedAt')

        return query
    }

    const queryGeneratorPaginated = async (
        options: QueryFields<T>
    ): Promise<PaginatedResult<T>> => {

        let query = db(table)
                .select(options.fields || '*')
                .where(options.where || {})

        if (options.whereSign) {
            query = query.where(options.whereSign.field, options.whereSign.sign, options.whereSign.value);
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
        if (options.whereSign) {
            countQuery = countQuery.where(options.whereSign.field, options.whereSign.sign, options.whereSign.value);
        }

        const [ result, totalCount ] = await Promise.all([
            query,
            countQuery
        ]);

        const total = totalCount ? parseInt(totalCount.count as string) : 0 as number;

        return {
            data: result as OutputData<T>[] ?? [],
            pagination: {
                page: Math.floor((skipRecords || 0) / (options.limit || 10)) + 1,
                limit: options.limit || 10,
                total: total,
                totalPages: Math.ceil(total / (options.limit || 10)),
                hasNext: (skipRecords || 0) + (options.limit || 10) < total,
                hasPrev: (skipRecords || 0) > 0
            }
        } as PaginatedResult<T>;
        
    }
    
    const findAll = async ( 
        options: QueryFields<T> = {} 
    ): Promise<OutputData<T>[]> => {
        
        const result = await queryGenerator({
            fields: options.fields,
            limit: options.limit || 10,
            offset: options.offset || 0,
            orderBy: options.orderBy || 'id',
            order: options.order || 'asc',
            whereSign: options.whereSign
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
            whereSign: options.whereSign
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

    return { findAll, findById, findBy, findByPaginated, findAllPaginated }
    
}