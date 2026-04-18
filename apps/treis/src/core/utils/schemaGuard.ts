import { apiError } from './error';
import { HttpStatus } from '@constants';
import { sMessage } from '@app-types';

/**
 * Converte string snake_case para camelCase.
 */
const toCamelCase = (str: string): string => {
    return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
};

/**
 * Valida se os campos fornecidos estão presentes nos campos permitidos da tabela.
 * Considera que as colunas do banco estão em snake_case e o objeto de dados em camelCase.
 */
export const validateSchema = (data: Record<string, unknown>, allowedFields: string[], entityName: string) => {
    // Converte as colunas do banco para camelCase para comparar com o objeto de dados
    const allowedFieldsCamel = allowedFields.map(toCamelCase);

    const invalidFields = Object.keys(data).filter(key => !allowedFieldsCamel.includes(key));

    if (invalidFields.length > 0) {
        throw new apiError(
            { message: `Campos inválidos para persistência em ${entityName}: ${invalidFields.join(', ')}` } as sMessage,
            HttpStatus.BAD_REQUEST
        );
    }
};
