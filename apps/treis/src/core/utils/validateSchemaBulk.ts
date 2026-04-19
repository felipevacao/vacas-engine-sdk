import { validateSchema } from './schemaGuard';

export const validateSchemaBulk = <T>(
    data: T[],
    fields: string[],
    table: string
): boolean => {
    const errors: { index: number; errors: unknown[] }[] = [];

    data.forEach((item, index) => {
        try {
            validateSchema(item as Record<string, unknown>, fields, table);
        } catch (error: unknown) {
            const err = error as { errors?: unknown[], message: string };
            errors.push({ index, errors: err.errors || [err.message] });
        }
    });

    if (errors.length > 0) {
        const bulkError = new Error("Validation failed in bulk operation");
        (bulkError as any).errors = errors; 
        throw bulkError;
    }

    return true;
};