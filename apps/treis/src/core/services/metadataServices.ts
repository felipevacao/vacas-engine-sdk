import { db, Cache } from '@utils'
import { readFileSync } from 'fs';
import { join } from 'path';
import {
  DatabaseFieldInfo,
  EnhancedFieldMetadata,
  EnhancedTableMetadata,
  EnumInfo,
  ManifestFieldConfig,
  TableManifest,
  RelationshipsTable
} from '@interfaces';
import { METADATA_EXCLUDED_FIELDS } from '@constants';

export class MetadataService {
  private db: typeof db;

  constructor(
    private tableName: string
  ) {
    this.db = db;
  }

  async getTableMetadata(depth: number = 1): Promise<EnhancedTableMetadata> {
    const cacheKey = `metadata:${this.tableName}:d${depth}`;
    const cached = Cache.get<EnhancedTableMetadata>(cacheKey);

    if (cached) {
      return cached;
    }

    const tableName = this.tableName

    // 1. Extrair informações do banco
    const dbFields = await this.extractDatabaseFields(tableName);
    const relationships = await this.extractRelationships(tableName);
    const constraints = await this.extractConstraints(tableName);
    const enums = await this.extractEnumValues(dbFields);

    // 2. Carregar configurações do manifest
    const manifest = this.loadTableManifest(tableName);

    // 3. Combinar as informações
    const fields = this.combineFieldsMetadata(dbFields, manifest.fields || {}, enums || {});

    const requestRaw = this.getTableObject(fields);

    // 4. Prefetching: carregar metadados das relações
    const relatedMetadata: Record<string, EnhancedTableMetadata> = {};
    if (depth > 0) {
      for (const rel of relationships) {
        try {
          const relatedService = new MetadataService(rel.table);
          relatedMetadata[rel.name] = await relatedService.getTableMetadata(depth - 1);
        } catch (e) {
          console.error(`Falha ao carregar prefetch para ${rel.table}`, e);
        }
      }
    }

    const metadata: EnhancedTableMetadata = {
      table: manifest.tableName || tableName,
      displayName: manifest.displayName || this.formatTableName(tableName),
      description: manifest.description,
      fields,
      relationships,
      relatedMetadata: Object.keys(relatedMetadata).length > 0 ? relatedMetadata : undefined,
      config: manifest.config,
      tableValidations: this.extractTableValidations(constraints),
      requestRaw
    };

    Cache.set(cacheKey, metadata);
    return metadata;
  }

  private transformarComRegex(input: string): string {
    return input
      .replace(/^\{|\}$/g, '') // Remove chaves do início/fim
      .replace(/\s*,\s*/g, ' | '); // Substitui vírgulas por |
  }

  private getTableObject(fields: EnhancedFieldMetadata[]): Record<string, string> {
    return fields.reduce((acc, field) => {
      if (field.name === 'id') {
        return acc; // Skip 'id' field to avoid redundancy
      }
      acc[field.name] = field.type == 'enum'
        ? this.transformarComRegex(field.enum_values?.toString() as string) ?? field.defaultValue as string
        : field.defaultValue as string ?? '';
      return acc;
    }, {} as Record<string, string>);
  }
  // Novo método para extrair valores ENUM
  private async extractEnumValues(dbFields: DatabaseFieldInfo[]): Promise<EnumInfo[] | []> {
    // Encontra todos os tipos ENUM usados nos campos
    const enumTypes = dbFields
      .filter(field => field.data_type === 'USER-DEFINED' && field.udt_name)
      .map(field => field.udt_name!)
      .filter((value, index, self) => self.indexOf(value) === index);

    if (enumTypes.length === 0) {
      return [];
    }

    const results: EnumInfo[] = [];

    for (const enumType of enumTypes) {
      const query = `
      SELECT 
        t.typname as enum_name,
        array_agg(e.enumlabel ORDER BY e.enumsortorder) as enum_values
      FROM pg_type t 
      JOIN pg_enum e ON t.oid = e.enumtypid 
      WHERE t.typname = ?
      GROUP BY t.typname
    `;

      const result = await this.db.raw(query, [enumType]);
      if (result.rows && result.rows.length > 0) {
        results.push(...result.rows);
      }
    }

    return results;
  }

  private async extractDatabaseFields(tableName: string): Promise<DatabaseFieldInfo[]> {
    const query = `
      SELECT 
        c.column_name,
        c.data_type,
        c.udt_name,
        c.is_nullable,
        c.column_default,
        c.character_maximum_length,
        c.numeric_precision,
        c.numeric_scale,
        tc.constraint_type,
        kcu2.table_name as foreign_table,
        kcu2.column_name as foreign_column,
        cc.check_clause
      FROM information_schema.columns c
      LEFT JOIN information_schema.key_column_usage kcu 
        ON c.table_name = kcu.table_name 
        AND c.column_name = kcu.column_name
      LEFT JOIN information_schema.table_constraints tc 
        ON kcu.constraint_name = tc.constraint_name
      LEFT JOIN information_schema.referential_constraints rc 
        ON kcu.constraint_name = rc.constraint_name
      LEFT JOIN information_schema.key_column_usage kcu2 
        ON rc.unique_constraint_name = kcu2.constraint_name
      LEFT JOIN information_schema.check_constraints cc 
        ON tc.constraint_name = cc.constraint_name
      WHERE c.table_name = ?
      AND c.table_schema = 'public'
      AND c.column_name NOT IN ('id', ${METADATA_EXCLUDED_FIELDS.map(f => `'${f}'`).join(', ')})
      ORDER BY c.ordinal_position
    `;

    return await this.db.raw(query, [tableName]).then(result => result.rows);
  }

  private async extractRelationships(tableName: string): Promise<RelationshipsTable[]> {
    const query = `
      SELECT 
        kcu.column_name,
        kcu.constraint_name,
        rel_kcu.table_name as foreign_table,
        rel_kcu.column_name as foreign_column
      FROM information_schema.key_column_usage kcu
      JOIN information_schema.referential_constraints rco 
        ON kcu.constraint_name = rco.constraint_name
      JOIN information_schema.key_column_usage rel_kcu 
        ON rco.unique_constraint_name = rel_kcu.constraint_name
      WHERE kcu.table_name = ?
    `;

    const fks = await this.db.raw(query, [tableName]).then(result => result.rows);

    return fks.map((fk: { foreign_table: string; column_name: unknown; foreign_column: unknown; }) => ({
      name: this.camelCase(fk.foreign_table),
      type: 'belongsTo' as const,
      table: fk.foreign_table,
      foreignKey: fk.column_name,
      localKey: fk.foreign_column
    }));
  }

  private async extractConstraints(tableName: string): Promise<[{ constraint_name: string; constraint_type: string; column_name: string; check_clause: string | null }]> {
    const query = `
      SELECT 
        tc.constraint_name,
        tc.constraint_type,
        kcu.column_name,
        cc.check_clause
      FROM information_schema.table_constraints tc
      LEFT JOIN information_schema.key_column_usage kcu 
        ON tc.constraint_name = kcu.constraint_name
      LEFT JOIN information_schema.check_constraints cc 
        ON tc.constraint_name = cc.constraint_name
      WHERE tc.table_name = ?
      AND tc.constraint_type IN ('UNIQUE', 'CHECK')
    `;

    return await this.db.raw(query, [tableName]).then(result => result.rows);
  }

  private loadTableManifest(tableName: string, path: string = '/src/dynamic-modules'): TableManifest {
    try {
      console.log(process.cwd() + path)
      const manifestPath = join(process.cwd(), `${path}/${tableName}/manifest.json`);
      const manifestContent = readFileSync(manifestPath, 'utf-8');

      return JSON.parse(manifestContent)[tableName];

    } catch {
      // Se não existir manifest, retorna configuração padrão
      return this.loadTableManifest(tableName, '/src/core/modules') || {};
    }
  }

  private combineFieldsMetadata(
    dbFields: DatabaseFieldInfo[],
    manifestFields: Record<string, ManifestFieldConfig>,
    enums: EnumInfo[]
  ): EnhancedFieldMetadata[] {
    // Organiza enums por nome
    const enumsByName = enums.reduce((acc, enumInfo) => {
      acc[enumInfo.enum_name] = enumInfo.enum_values;
      return acc;
    }, {} as Record<string, string[]>);

    return dbFields.map(dbField => {
      const manifestField = manifestFields[dbField.column_name] || {};

      // Padroniza valores de ENUM para { value, label }
      const enumValues = dbField.udt_name ? enumsByName[dbField.udt_name] : [];
      const standardizedOptions = manifestField.options || enumValues.map(val => ({
        value: val,
        label: this.formatFieldName(val)
      }));

      return {
        // Informações do banco
        name: dbField.column_name,
        type: this.mapDatabaseType(dbField.data_type),
        maxLength: dbField.character_maximum_length || undefined,
        required: dbField.is_nullable === 'NO',
        defaultValue: this.parseDefaultValue(dbField.column_default),
        enum_values: enumValues,
        udt_name: dbField.udt_name,

        // Informações do manifest (com fallbacks inteligentes)
        formType: (manifestField.formType as EnhancedFieldMetadata['formType']) || this.inferFormType(dbField),
        label: manifestField.label || this.formatFieldName(dbField.column_name),

        // 1. Validações combinadas
        validation: {
          ...this.extractDatabaseValidations(dbField),
          ...manifestField.validation
        },

        // 2. Opções (ENUM ou Estáticas do Manifest)
        options: standardizedOptions.length > 0 ? standardizedOptions : undefined,

        // 3. Relacionamentos (FK)
        ...(dbField.foreign_table && {
          relationship: {
            table: dbField.foreign_table,
            valueField: dbField.foreign_column || 'id',
            labelField: 'name', // padrão, pode ser sobrescrito no manifest
            searchable: true
          }
        }),

        // 4. Configurações de Exibição (Novo)
        display: {
          placeholder: manifestField.display?.placeholder || `Digite o ${manifestField.label || this.formatFieldName(dbField.column_name)}`,
          helpText: manifestField.display?.helpText,
          icon: manifestField.display?.icon,
          width: manifestField.display?.width || 'full',
          order: manifestField.display?.order,
          group: manifestField.display?.group,
          conditional: manifestField.display?.conditional
        },

        // 5. Formatação e Máscara (Novo)
        format: {
          mask: manifestField.format?.mask,
          currency: manifestField.format?.currency,
          percentage: manifestField.format?.percentage,
          decimal: manifestField.format?.decimal,
          uppercase: manifestField.format?.uppercase,
          lowercase: manifestField.format?.lowercase
        },

        // 6. Configurações de CRUD
        crud: {
          creatable: true,
          editable: true,
          listable: true,
          searchable: !dbField.column_name.includes('password'),
          sortable: true,
          filterable: false,
          ...manifestField.crud
        },

        // 7. Configurações extras
        config: {
          ...manifestField.config,
          readonly: manifestField.config?.readonly || false,
          hidden: manifestField.config?.hidden || false
        }
      };
    });
  }

  private mapDatabaseType(pgType: string): string {
    const typeMap: Record<string, string> = {
      'character varying': 'string',
      'varchar': 'string',
      'text': 'string',
      'integer': 'integer',
      'bigint': 'integer',
      'smallint': 'integer',
      'decimal': 'decimal',
      'numeric': 'decimal',
      'real': 'decimal',
      'double precision': 'decimal',
      'boolean': 'boolean',
      'date': 'date',
      'timestamp': 'datetime',
      'timestamptz': 'datetime',
      'time': 'time',
      'json': 'json',
      'jsonb': 'json',
      'uuid': 'string',
      'USER-DEFINED': 'enum', // Para tipos ENUM
    };

    return typeMap[pgType] || 'string';
  }

  private inferFormType(dbField: DatabaseFieldInfo): EnhancedFieldMetadata['formType'] {
    // Inferir o tipo de formulário baseado no tipo do banco e nome do campo
    if (dbField.foreign_table) return 'select';
    if (dbField.column_name.includes('password')) return 'password';
    if (dbField.column_name.includes('email')) return 'email';
    if (dbField.column_name.includes('phone') || dbField.column_name.includes('tel')) return 'tel';
    if (dbField.column_name.includes('url')) return 'url';
    if (dbField.data_type === 'boolean') return 'checkbox';
    if (dbField.data_type === 'date') return 'date';
    if (dbField.data_type === 'timestamp' || dbField.data_type === 'timestamptz') return 'datetime';
    if (dbField.data_type === 'text' && dbField.column_name.includes('description')) return 'textarea';
    if (['integer', 'bigint', 'smallint', 'decimal', 'numeric'].includes(dbField.data_type)) return 'number';

    return 'text';
  }

  private extractDatabaseValidations(dbField: DatabaseFieldInfo) {
    const validation = {} as Record<string, unknown>;

    if (dbField.character_maximum_length) {
      validation.maxLength = dbField.character_maximum_length;
    }

    if (dbField.check_clause) {
      // Extrair validações de check constraints
      // Ex: CHECK (age >= 18) -> min: 18
      const ageMatch = dbField.check_clause.match(/(\w+)\s*>=\s*(\d+)/);
      if (ageMatch) {
        validation.min = parseInt(ageMatch[2]);
      }
    }

    return validation;
  }

  private extractTableValidations(constraints: [{ constraint_name: string; constraint_type: string; column_name: string; check_clause: string | null }] | [])
    : { rule: string; message: string; fields: string[] }[] {
    return constraints
      .filter((c) => c.constraint_type === 'UNIQUE')
      .map((c) => ({
        rule: `unique_${c.column_name}`,
        message: `Este ${c.column_name} já está sendo usado`,
        fields: [c.column_name]
      }));
  }

  private formatTableName(tableName: string): string {
    return tableName
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  }

  private formatFieldName(fieldName: string): string {
    return fieldName
      .replace(/_/g, ' ')
      .replace(/Id$/, '')
      .replace(/\b\w/g, l => l.toUpperCase());
  }

  private camelCase(str: string): string {
    return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
  }

  private parseDefaultValue(defaultValue: string | null): string | number | null | undefined {
    if (!defaultValue) return undefined;
    if (defaultValue === 'NULL') return null;
    if (defaultValue.startsWith("'") && defaultValue.endsWith("'")) {
      return defaultValue.slice(1, -1);
    }
    if (!isNaN(Number(defaultValue))) {
      return Number(defaultValue);
    }
    return defaultValue;
  }
}
