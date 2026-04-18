import { Knex } from 'knex';
import { QueryFields } from '@app-types';
import { BaseEntity } from '@interfaces';

/**
 * Aplica filtros dinâmicos a uma query do Knex de forma tipada e segura.
 * Resolve problemas de tipos com operadores que esperam arrays (IN, BETWEEN).
 */
export const applyFilters = <T extends BaseEntity, TRecord extends {}, TResult>(
    query: Knex.QueryBuilder<TRecord, TResult>,
    options: QueryFields<T>
): Knex.QueryBuilder<TRecord, TResult> => {
    if (options.filters) {
        options.filters.forEach(filter => {
            const { field, operator, value } = filter;

            if (operator === 'IN' && Array.isArray(value)) {
                query.whereIn(field, value);
            } else if (operator === 'BETWEEN' && Array.isArray(value) && value.length === 2) {
                query.whereBetween(field, [value[0] as string | number, value[1] as string | number]);
            } else if (!Array.isArray(value)) {
                // Garantimos que para operadores comuns o valor não seja array para satisfazer a tipagem do Knex
                query.where(field, operator, value as string | number | boolean | Date);
            }
        });
    }
    return query;
};
