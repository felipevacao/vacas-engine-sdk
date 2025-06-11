import { db } from '@utils/db'
import { Metadata } from 'types/entity';

export const metadata = (table: string) => {
    return async ()
    : Promise<Metadata | null> => {
        try {
        const [fields] = await Promise.all([
            getTableFields(table),
            // getTableRelationships(table),
            // getTableConstraints(table)
        ]);

        return {
            table,
            fields,
            // relationships,
            // constraints
        };
        } catch (error) {
            console.error(`Erro ao obter metadata da tabela ${table}:`, error);
        }
        return null;
    }

    /**
     * 
     * @param tableName 
     * @returns 
     */
    async function getTableFields(
        tableName: string
    ): Promise<[]> {

        const Fields = await db('information_schema.columns')
            .select('column_name', 'data_type', 'character_maximum_length', 'is_nullable')
            .where('table_name', tableName)
            .whereNot('column_name', 'id')
            .whereNot('column_name', 'created_at')
            .whereNot('column_name', 'updated_at')
            .whereNot('column_name', 'deleted_at')
            .orderBy('ordinal_position')
            return Fields.map(field => {
                return {
                    name: field.columnName,
                    type: mapDataType(field.dataType),
                    maxLength: field.characterMaximumLength,
                    isNullable: field.isNullable
                }
            }) as [];
    }

    /**
     * 
     * @param knexType 
     * @returns 
     */
    function mapDataType(knexType: string): string {
        const typeMap: { [key: string]: string } = {
        'character varying': 'string',
        'varchar': 'string',
        'text': 'string',
        'integer': 'number',
        'bigint': 'number',
        'decimal': 'number',
        'numeric': 'number',
        'boolean': 'boolean',
        'timestamp': 'datetime',
        'date': 'date',
        'time': 'time',
        'json': 'object',
        'jsonb': 'object'
        };

        return typeMap[knexType.toLowerCase()] || 'string';

    }
}

