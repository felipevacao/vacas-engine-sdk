import { describe, it, expect, vi } from 'vitest';
import { validateSchemaBulk } from './validateSchemaBulk';
import * as schemaGuard from './schemaGuard';

vi.mock('./schemaGuard', () => ({
  validateSchema: vi.fn(),
}));

describe('Utils: validateSchemaBulk', () => {
  it('should return true if all items are valid', () => {
    const data = [{}, {}];
    const result = validateSchemaBulk(data, [], 'table');
    expect(result).toBe(true);
  });

  it('should throw error if any item is invalid', () => {
    (schemaGuard.validateSchema as any).mockImplementation((item: any) => {
      if (item.invalid) throw new Error("Invalid");
    });

    const data = [{ invalid: true }];
    expect(() => validateSchemaBulk(data, [], 'table')).toThrow("Validation failed in bulk operation");
  });

  it('should aggregate multiple errors from different items', () => {
    (schemaGuard.validateSchema as any).mockImplementation((item: any) => {
      if (item.invalid) throw { errors: ["Error 1"] };
    });

    const data = [{ invalid: true }, { invalid: true }];
    try {
        validateSchemaBulk(data, [], 'table');
    } catch (e: any) {
        expect(e.errors).toHaveLength(2);
        expect(e.errors[0].index).toBe(0);
        expect(e.errors[1].index).toBe(1);
    }
  });
});