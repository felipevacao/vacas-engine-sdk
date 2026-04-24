import {
	CreateData,
	UpdateData,
	QueryFields,
	OutputData,
	QueryFilter
} from '../types'

export interface InputRequest<T> {
	originalUrl?: string
	body?: object
	params?: object,
	query: {
		fields?: string
		where?: Partial<T>
		filter?: string | [] | undefined
		orderBy?: string
		order?: 'asc' | 'desc'
		limit?: number
		offset?: number
		page?: number
		pageSize?: number
		links?: string
		paginated?: string
		include?: string
	}
}

export interface Metadata {
	table: string
	fields: {
		name: string
		type: string
		maxLength: number
		formType?: string
		label?: string
		required?: boolean
	}[]

	// relationships?: unknown[] // Placeholder for future relationships
	// constraints?: unknown[] // Placeholder for future constraints
}

export interface PaginatedResult<T extends BaseEntity> {
	data: T[]
	pagination: {
		page: number
		limit: number
		total: number
		totalPages: number
		hasNext: boolean
		hasPrev: boolean
		nextPageUrl?: string | null
		prevPageUrl?: string | null
	}
}

export interface IAdapter<T, U> {
	create(input: T, output: U): Promise<void>;
	findAll(input: T, output: U): Promise<void>;
	findById(input: T, output: U): Promise<void>;
	findBy(input: T, output: U): Promise<void>;
}


export interface IController<T extends BaseEntity> {

	getModelTable(): string;
	getModel(): Model<T>;
	getDefaultFields(): (keyof T)[];
	getSelectetAbleFields(): (keyof T)[];
	getExcludedFields(): (keyof T)[];
	createEntity(data: CreateData<T>, options: QueryFields<T>): Promise<OutputData<T>>;
	findAllEntity(options: QueryFields<T>): Promise<OutputData<T>[]>;
	findAllEntityPaginated(options: QueryFields<T>): Promise<PaginatedResult<T>>;
	findByIdEntity(id: number | string, options: QueryFields<T>): Promise<OutputData<T> | undefined>;
	findByEntity(options: QueryFields<T>): Promise<OutputData<T>[] | undefined>;
	findByEntityPaginated(options: QueryFields<T>): Promise<PaginatedResult<T>>;
	updateEntity(id: number | string, data: UpdateData<T>, options: QueryFields<T>): Promise<OutputData<T>>;
	createBulkEntity(data: CreateData<T>[], options: QueryFields<T>): Promise<OutputData<T>[]>;
	updateBulkEntity(ids: (number | string)[], data: UpdateData<T>, options: QueryFields<T>): Promise<OutputData<T>[]>;
	deleteBulkEntity(ids: (number | string)[]): Promise<boolean>;
	deleteEntity(id: number): Promise<boolean>;
	forceDeleteEntity(id: number): Promise<boolean>;
	count(options: QueryFields<T>): Promise<number>;
	getDefaultFilters(): QueryFilter[];

}

export interface BaseEntity {
	id?: number | string;
	createdAt?: Date;
	updatedAt?: Date;
	deletedAt?: Date | null;
}

/**
 * Interfaces para representar o google.protobuf.Struct de forma tipada
 */
export interface ProtobufValue {
	kind?: 'stringValue' | 'numberValue' | 'boolValue' | 'structValue' | 'listValue' | 'nullValue';
	stringValue?: string;
	numberValue?: number;
	boolValue?: boolean;
	structValue?: ProtobufStruct;
	listValue?: { values: ProtobufValue[] };
	nullValue?: 0;
}

export interface ProtobufStruct {
	fields: Record<string, ProtobufValue>;
}

export interface HashResult {
	passwordHash: string;
	pepper: string;
}

// Estrutura atual (básica)
export interface BasicFieldMetadata {
	name: string;
	type: string;
	maxLength?: number;
	formType: string;
	label: string;
	required: boolean;
}

// Estrutura aprimorada (completa)
export interface EnhancedFieldMetadata {
	// Básico (já existente)
	name: string;
	type: string;
	maxLength?: number;
	label: string;
	required: boolean;

	enum_values?: string[];
	udt_name?: string;

	// 1. VALIDAÇÕES AVANÇADAS
	validation?: {
		minLength?: number;
		maxLength?: number;
		min?: number;        // Para números
		max?: number;        // Para números
		pattern?: string;    // Regex pattern
		custom?: string[];   // Regras customizadas
	};

	// 2. TIPOS DE CAMPO MAIS RICOS
	formType?: 'text' | 'email' | 'password' | 'number' | 'date' | 'datetime' |
	'select' | 'multiselect' | 'radio' | 'checkbox' | 'textarea' |
	'file' | 'image' | 'color' | 'range' | 'url' | 'tel';

	// 3. OPÇÕES PARA SELECTS/RADIOS
	options?: Array<{
		value: string | number;
		label: string;
		disabled?: boolean;
	}>;

	// 4. RELACIONAMENTOS (FK)
	relationship?: {
		table: string;        // Tabela relacionada
		valueField: string;   // Campo valor (geralmente id)
		labelField: string;   // Campo para exibição
		endpoint?: string;    // Endpoint customizado
		searchable?: boolean; // Se permite busca
	};

	// 5. CONFIGURAÇÕES DE EXIBIÇÃO
	display?: {
		placeholder?: string;
		helpText?: string;
		icon?: string;
		width?: 'full' | 'half' | 'third' | 'quarter';
		order?: number;       // Ordem no formulário
		group?: string;       // Agrupamento de campos
		conditional?: {       // Exibir condicionalmente
			field: string;
			value: unknown | unknown[]; // Valor(s) que ativa a condição
			operator: '=' | '!=' | '>' | '<' | 'in' | 'contains';
		};
	};

	// 6. FORMATAÇÃO E MÁSCARA
	format?: {
		mask?: string;        // Máscara de entrada (ex: "(##) #####-####")
		currency?: boolean;   // Formatação monetária
		percentage?: boolean; // Formatação percentual
		decimal?: number;     // Casas decimais
		uppercase?: boolean;  // Converter para maiúscula
		lowercase?: boolean;  // Converter para minúscula
	};

	// 7. COMPORTAMENTO NO CRUD
	crud?: {
		creatable?: boolean;  // Aparece no create
		editable?: boolean;   // Aparece no edit
		listable?: boolean;   // Aparece na listagem
		searchable?: boolean; // Permite busca
		sortable?: boolean;   // Permite ordenação
		filterable?: boolean; // Permite filtros
	};

	// 8. CONFIGURAÇÕES ESPECÍFICAS
	config?: {
		multiple?: boolean;   // Para files/selects múltiplos
		accept?: string;      // Para file inputs
		rows?: number;        // Para textarea
		step?: number;        // Para number/range
		readonly?: boolean;   // Campo somente leitura
		hidden?: boolean;     // Campo oculto
	};

	// 9. VALORES PADRÃO
	defaultValue?: unknown;

	// 10. METADADOS EXTRAS
	meta?: {
		description?: string;
		example?: string;
		version?: string;
		deprecated?: boolean;
	};
}

// Estrutura completa da tabela
export interface EnhancedTableMetadata {
	table: string;
	displayName: string;
	description?: string;

	// Campos
	fields: EnhancedFieldMetadata[];

	// Configurações da tabela
	config?: {
		// Paginação
		pagination?: {
			defaultLimit: number;
			maxLimit: number;
		};

		// Ordenação padrão
		defaultSort?: {
			field: string;
			direction: 'asc' | 'desc';
		};

		// Filtros disponíveis
		filters?: Array<{
			field: string;
			type: 'text' | 'select' | 'date' | 'number';
			options?: Array<{ value: unknown; label: string }>;
		}>;

		// Ações disponíveis
		actions?: {
			create?: boolean;
			read?: boolean;
			update?: boolean;
			delete?: boolean;
			export?: boolean;
			import?: boolean;
		};

		// Permissões
		permissions?: {
			role: string;
			actions: string[];
		}[];
	};

	// Relacionamentos da tabela
	relationships?: Array<{
		name: string;
		type: 'hasOne' | 'hasMany' | 'belongsTo' | 'manyToMany';
		table: string;
		foreignKey?: string;
		localKey?: string;
	}>;

	// Validações no nível da tabela
	tableValidations?: Array<{
		rule: string;
		message: string;
		fields: string[];
	}>
	// Exemplo de objeto a ser enviado na requisição
	requestRaw?: object;
}

export interface EnumInfo {
	enum_name: string;
	enum_values: string[];
}

export interface DatabaseFieldInfo {
	column_name: string;
	data_type: string;
	udt_name: string;
	is_nullable: string;
	column_default: string | null;
	character_maximum_length: number | null;
	numeric_precision: number | null;
	numeric_scale: number | null;
	constraint_type?: string;
	foreign_table?: string;
	foreign_column?: string;
	check_clause?: string;
}

export interface ManifestFieldConfig {
	formType?: string;
	label?: string;
	display?: {
		placeholder?: string;
		helpText?: string;
		icon?: string;
		width?: 'full' | 'half' | 'third' | 'quarter';
		order?: number;
		group?: string;
		conditional?: {
			field: string;
			value: unknown | unknown[];
			operator: '=' | '!=' | '>' | '<' | 'in' | 'contains';
		};
	};
	format?: {
		mask?: string;
		currency?: boolean;
		percentage?: boolean;
		decimal?: number;
		uppercase?: boolean;
		lowercase?: boolean;
	};
	crud?: {
		creatable?: boolean;
		editable?: boolean;
		listable?: boolean;
		searchable?: boolean;
		sortable?: boolean;
		filterable?: boolean;
	};
	options?: Array<{
		value: string | number;
		label: string;
		disabled?: boolean;
	}>;
	validation?: {
		pattern?: string;
		custom?: string[];
	};
	config?: {
		multiple?: boolean;
		accept?: string;
		rows?: number;
		step?: number;
		readonly?: boolean;
		hidden?: boolean;
	};
}

export interface TableManifest {
	displayName?: string;
	description?: string;
	fields?: Record<string, ManifestFieldConfig>;
	config?: {
		pagination?: {
			defaultLimit: number;
			maxLimit: number;
		};
		defaultSort?: {
			field: string;
			direction: 'asc' | 'desc';
		};
		actions?: {
			create?: boolean;
			read?: boolean;
			update?: boolean;
			delete?: boolean;
			export?: boolean;
			import?: boolean;
		};
		permissions?: {
			role: string;
			actions: string[];
		}[];
	};
}

// API Response Structure
export interface MetadataApiResponse {
	success: boolean;
	message: string;
	data: EnhancedTableMetadata;
	meta: {
		timestamp: string;
		version: string;
		generatedFrom: string; // Ex: "database_schema", "manual_config"
	};
}



export interface Relation {
	type: 'belongsTo' | 'hasMany' | 'hasOne' | 'belongsToMany';
	table: string;
	localKey: string;
	foreignKey: string;
	pivotTable?: string; // Para belongsToMany
}

export interface Model<T extends BaseEntity> {
	table: string,
	create: (data: CreateData<T>, options: QueryFields<T>) => Promise<OutputData<T>>,
	findAll: (options: QueryFields<T>) => Promise<OutputData<T>[]>,
	findAllPaginated: (options: QueryFields<T>) => Promise<PaginatedResult<T>>,
	findById: (id: number | string, options: QueryFields<T>) => Promise<OutputData<T> | undefined>,
	findBy: (options: QueryFields<T>) => Promise<OutputData<T>[] | undefined>,
	findByPaginated: (options: QueryFields<T>) => Promise<PaginatedResult<T>>,
	update: (id: number | string, data: UpdateData<T>, options: QueryFields<T>) => Promise<OutputData<T>>,
	delete: (id: number | string, options?: QueryFields<T>) => Promise<boolean>,
	forceDelete: (id: number | string, options?: QueryFields<T>) => Promise<boolean>,
	count: (options?: QueryFields<T>) => Promise<number>,
	createBulk: (data: CreateData<T>[], options: QueryFields<T>) => Promise<OutputData<T>[]>,
	updateBulk: (ids: (number | string)[], data: UpdateData<T>, options: QueryFields<T>) => Promise<OutputData<T>[]>,
	deleteBulk: (ids: (number | string)[]) => Promise<boolean>,
	selectAbleFields: (keyof T)[],
	defaultFields: (keyof T)[],
	excludedFields: (keyof T)[],
	metadata: () => Promise<Metadata> | null,
	relations?: Record<string, Relation>
}

export interface ApiResponse<T = unknown> {
	success: boolean;
	message: string;
	data?: T;
	error?: {
		code: string;
		message: string;
		details?: unknown;
	};
	meta?: {
		timestamp: string;
		requestId?: string;
		metadataUrl?: string;
		pagination?: {
			page: number;
			limit: number;
			total: number;
			totalPages: number;
			hasNext: boolean;
			hasPrev: boolean;
		};
	};
}


export interface IBaseServices {
	findEntityBy(options: QueryFields<BaseEntity>): Promise<OutputData<BaseEntity>[]>;
	getModelTable(): string;
	getAvailableFields(extraFields?: string[]): string[];
}

export type VirtualFieldResolver<T extends BaseEntity> = (row: T) => unknown;

export interface IVirtualFieldDefinition<T extends BaseEntity> {
	[fieldName: string]: VirtualFieldResolver<T>;
}

