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