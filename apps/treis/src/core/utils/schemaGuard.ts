import { apiError } from '@utils/error';
import { HttpStatus } from '@constants/HttpStatus';
import { sMessage } from '@core/constants/messages';

/**
 * Valida se os campos fornecidos estão presentes nos campos permitidos da tabela.
 * Isso provê segurança extra ao lidar com casts 'any' em operações de banco.
 */
export const validateSchema = (data: Record<string, unknown>, allowedFields: string[], entityName: string) => {
    const invalidFields = Object.keys(data).filter(key => !allowedFields.includes(key));
    if (invalidFields.length > 0) {
        throw new apiError(
            { message: `Campos inválidos para persistência em ${entityName}: ${invalidFields.join(', ')}` } as sMessage,
            HttpStatus.BAD_REQUEST
        );
    }
};
