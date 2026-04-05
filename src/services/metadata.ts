import { db } from '@utils/db'
import { Metadata } from 'types/entity';
import { METADATA_EXCLUDED_FIELDS } from '../constants/sensitiveFields';

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
            .whereNotIn('column_name', METADATA_EXCLUDED_FIELDS)
            .orderBy('ordinal_position')
            return Fields.map(field => {
                return {
                    name: field.columnName,
                    type: mapDataType(field.dataType),
                    maxLength: field.characterMaximumLength,
                    formType: getFormType(field.dataType, field.columnName),
                    label: generateLabel(field.columnName),
                    required: field.isNullable === 'NO'
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

    function getFormType(dbType: string, fieldName: string): string {
    const name = fieldName.toLowerCase();
    
    // Por nome do campo
    if (name.includes('email')) return 'email';
    if (name.includes('password')) return 'password';
    if (name.includes('phone')) return 'tel';
    if (name.includes('url') || name.includes('link')) return 'url';
    if (name === 'id' || name.endsWith('_id')) return 'hidden';
    
    // Por tipo do banco
    switch (mapDataType(dbType)) {
      case 'boolean': return 'checkbox';
      case 'number': return 'number';
      case 'date': return 'date';
      case 'datetime': return 'datetime-local';
      case 'time': return 'time';
      case 'object': return 'textarea';
      default: return 'text';
    }
  }

  function generateLabel(fieldName: string): string {
    return fieldName
        .replace(/_/g, ' ')
        .replace(/([A-Z])/g, ' $1')
        .toLowerCase()
        .replace(/^./, str => str.toUpperCase())
        .trim();
  }
}

