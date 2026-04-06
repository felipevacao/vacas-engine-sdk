import { HttpStatus } from '@constants/HttpStatus';
import { apiError } from './error'
import { MESSAGES } from '@constants/messages'
import { ErrorContext } from '@app-types/entity';

/**
 * Interface para representar a estrutura de erros vindo do Banco de Dados (Knex/Postgres/MySQL)
 */
interface DatabaseError extends Error {
    code?: string;
    detail?: string;
    table?: string;
    constraint?: string;
}

/**
 * Classe centralizada para tradução e tratamento de erros.
 * Segue a estratégia de converter erros de baixo nível (banco, auth, etc.) 
 * em apiError (erros de domínio) que o adapter entende.
 */
export class ErrorHandler {

    /**
     * Traduz erros do banco de dados para apiError.
     */
    static handleDatabaseError(error: unknown, context: ErrorContext = {}): never {
        const dbError = error as DatabaseError;
        const details = [] as string[]
        details.push(dbError.message)

        if (context) {
            if (context.entity) {
                details.push(context.entity)
            }
            if (context.id) {
                details.push(context.id.toString())
            }
            if (context.details) {
                context.details.forEach(detail => {
                    details.push(detail)
                })
            }
        }

        // Exemplo: Unique Violation (Postgres: 23505)
        if (dbError.code === '23505') {
            context.details?.push('Registro duplicado detectado.')
            throw new apiError(
                MESSAGES.ERROR.OPERATION_ERROR,
                HttpStatus.CONFLICT,
                context
            )
        }

        // ForeignKey Violation (Postgres: 23503)
        if (dbError.code === '23503') {
            context.details?.push('Violação de chave estrangeira: recurso relacionado não encontrado.')
            throw new apiError(
                MESSAGES.ERROR.OPERATION_ERROR,
                HttpStatus.BAD_REQUEST,
                context
            )
        }
        // Erro genérico do banco
        context.details?.push('Erro interno no banco de dados')
        throw new apiError(
            MESSAGES.ERROR.OPERATION_ERROR,
            HttpStatus.INTERNAL_SERVER_ERROR,
            context
        )
    }
}
