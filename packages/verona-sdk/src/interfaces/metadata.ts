export interface FieldMetadata {
  name: string;
  type: string;
  maxLength?: number;
  formType: string;
  label: string;
  required: boolean;
  defaultValue?: unknown;
  options?: Array<{ value: string | number; label: string }>;
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
      operator: string;
    };
  };
  format?: {
    mask?: string;
    currency?: boolean;
    percentage?: boolean;
    decimal?: number;
  };
  validation?: {
    pattern?: string;
    min?: number;
    max?: number;
  };
  crud?: {
    creatable?: boolean;
    editable?: boolean;
    listable?: boolean;
    searchable?: boolean;
    sortable?: boolean;
    filterable?: boolean;
    isVirtual?: boolean; // Novo: Indica campo calculado
  };
}

export interface TableMetadata {
  table: string;
  displayName: string;
  description?: string;
  fields: FieldMetadata[];
  config?: {
    softDelete?: boolean; // Novo: Habilita lixeira
    versioning?: boolean; // Novo: Habilita histórico/rollback
    audit?: boolean;      // Novo: Habilita logs de auditoria
    [key: string]: any;
  };
}
