import fs from 'fs';
import path from 'path';
import { apiError } from '@utils/error';
import { MESSAGES } from '@constants/messages';
import { HttpStatus } from '@constants/HttpStatus';
import { stringUtils } from '@utils/string';

export class SystemService {
    private logDir = path.join(process.cwd(), 'logs');

    /**
     * Lê o conteúdo de um arquivo de log baseado na data e tipo.
     * @param date Data no formato YYYY-MM-DD
     * @param type Tipo do log ('error' ou 'access')
     */
    async getLogByDate(date: string, type: 'error' | 'access' = 'error'): Promise<string[]> {
        // Validação de formato YYYY-MM-DD para evitar Path Traversal
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            throw new apiError(
                { name: 'INVALID_FORMAT', message: 'Formato de data inválido. Use YYYY-MM-DD' },
                HttpStatus.BAD_REQUEST
            );
        }

        const filePath = path.join(this.logDir, `${type}-${date}.log`);

        if (!fs.existsSync(filePath)) {
            throw new apiError(
                MESSAGES.DATABASE.ENTITY.NOT_FOUND,
                HttpStatus.NOT_FOUND,
                { details: [`Arquivo de log para a data ${date} não encontrado.`] }
            );
        }

        try {
            const file = fs.readFileSync(filePath, 'utf8');
            return file.split(stringUtils.logSeparator())
        } catch (error) {
            throw new apiError(
                MESSAGES.ERROR.INTERNAL_ERROR,
                HttpStatus.INTERNAL_SERVER_ERROR,
                { details: [(error as Error).message] }
            );
        }
    }

    /**
     * Lista todos os arquivos de log disponíveis.
     */
    async listAvailableLogs(): Promise<string[]> {
        if (!fs.existsSync(this.logDir)) {
            return [];
        }
        return fs.readdirSync(this.logDir).filter(file => file.endsWith('.log'));
    }
}
