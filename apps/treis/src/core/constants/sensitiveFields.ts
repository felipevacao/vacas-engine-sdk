export const SENSITIVE_FIELDS = ['password', 'pepper', 'tokenHash'];
export const METADATA_EXCLUDED_FIELDS = [...SENSITIVE_FIELDS, 'created_at', 'updated_at', 'deleted_at'];
