import fs from 'fs';
import path from 'path';
import env from "@libs/env";
import { ErrorContext } from '@app-types';
import { stringUtils } from './string';

/**
 * Classe utilitária para centralizar logs da aplicação.
 * Suporta logs em console e em arquivos persistentes.
 */
export class Logger {
    private static logDir = path.join(process.cwd(), 'logs');

    /**
     * Garante que a pasta de logs existe.
     */
    private static ensureLogDir() {
        if (!fs.existsSync(this.logDir)) {
            fs.mkdirSync(this.logDir, { recursive: true });
        }
    }

    /**
     * Escreve uma mensagem em um arquivo de log.
     */
    private static writeToFile(filename: string, message: string) {
        try {
            this.ensureLogDir();
            const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
            const filePath = path.join(this.logDir, `${filename}-${date}.log`);
            const timestamp = new Date().toISOString();
            const logEntry = `[${timestamp}] ${message}` + stringUtils.logSeparator();

            fs.appendFileSync(filePath, logEntry, 'utf8');
        } catch (error) {
            // Se falhar ao gravar no arquivo, mostramos no console como último recurso
            console.error('Falha crítica ao gravar log em arquivo:', error);
        }
    }

    /**
     * Log de informação (Console)
     */
    static info(message: string) {
        if (env.ENABLE_CONSOLE_LOG) {
            console.log(`[INFO] ${message}`);
        }
    }

    /**
     * Log de aviso (Arquivo + Console)
     */
    static warn(message: string) {
        this.writeToFile('warn', message);
        if (env.ENABLE_CONSOLE_LOG) {
            console.warn(`[WARN] ${message}`);
        }
    }

    /**
     * Log de erro (Arquivo + Console opcional)
     */
    static error(message: string, error?: unknown, details?: ErrorContext) {
        let fullMessage = error instanceof Error
            ? `${message} \n| Error: ${error.message} `
            : `${message} \n| Error: ${JSON.stringify(error)}`;
        if (details) {
            if (details.entity) {
                fullMessage += ` \n| Entity: ${details.entity}`;
            }
            if (details.id) {
                fullMessage += ` \n| Id: ${details.id}`;
            }
            if (details.details) {
                details.details.forEach(detail => {
                    fullMessage += ` \n| Details: ${JSON.stringify(detail)}`;
                })
            }
        }
        if (error instanceof Error) {
            fullMessage += `\n| Stack: ${error.stack}`;
        }
        // Sempre grava erro em arquivo para persistência
        this.writeToFile('error', fullMessage);

        if (env.ENABLE_CONSOLE_LOG) {
            console.error(`[ERROR] ${message}`);
        }
    }

    /**
     * Log de acesso ou auditoria
     */
    static access(message: string) {
        this.writeToFile('access', message);
    }
}
