export interface FieldMetadata {
  name: string;
  type: string;
  maxLength: number | null;
  formType: string;
  label: string;
  required: boolean;
}

export interface TableMetadata {
  table: string;
  fields: FieldMetadata[];
}
