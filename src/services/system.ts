import fs from 'fs';
import path from 'path';
import { apiError } from '@utils/error';
import { MESSAGES } from '@constants/messages';
import { HttpStatus } from '@constants/HttpStatus';
import { stringUtils } from '@utils/string';
import { db } from '@utils/db';
import os from 'os';

export class SystemService {
    private logDir = path.join(process.cwd(), 'logs');

    /**
     * Retorna o status de saúde do sistema (Health Check).
     */
    async getSystemStatus(): Promise<unknown> {
        // 1. Database Check
        let dbStatus = 'connected';
        let dbLatency = 0;
        try {
            const dbStart = Date.now();
            await db.raw('SELECT 1');
            dbLatency = Date.now() - dbStart;
        } catch {
            dbStatus = 'disconnected';
        }

        // 2. Event Loop Lag (Medição simples)
        const lag = await this.measureEventLoopLag();

        // 3. Memory Usage
        const memUsage = process.memoryUsage();

        return {
            status: dbStatus === 'connected' ? 'healthy' : 'degraded',
            uptime: process.uptime(), // Segundos desde o início do processo
            timestamp: new Date().toISOString(),
            database: {
                status: dbStatus,
                latency: `${dbLatency}ms`
            },
            server: {
                platform: process.platform,
                nodeVersion: process.version,
                cpuCores: os.cpus().length,
                totalMemory: `${Math.round(os.totalmem() / 1024 / 1024)}MB`,
                freeMemory: `${Math.round(os.freemem() / 1024 / 1024)}MB`
            },
            process: {
                memory: {
                    rss: `${Math.round(memUsage.rss / 1024 / 1024)}MB`, // Total alocado para o processo
                    heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`,
                    heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
                    external: `${Math.round(memUsage.external / 1024 / 1024)}MB`
                },
                eventLoopLag: `${lag.toFixed(2)}ms`
            }
        };
    }

    /**
     * Mede o lag do Event Loop em milissegundos.
     */
    private measureEventLoopLag(): Promise<number> {
        return new Promise((resolve) => {
            const start = Date.now();
            setImmediate(() => {
                resolve(Date.now() - start);
            });
        });
    }

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

    /**
     * Remove arquivos de log mais antigos que a quantidade de dias especificada.
     * @param daysToKeep Quantidade de dias de logs que devem ser mantidos (padrão 7)
     */
    async deleteOldLogs(daysToKeep: number = 7): Promise<{ deleted: string[], count: number }> {
        if (!fs.existsSync(this.logDir)) {
            return { deleted: [], count: 0 };
        }

        const files = fs.readdirSync(this.logDir);
        const now = new Date();
        const deletedFiles: string[] = [];

        files.forEach(file => {
            if (file.endsWith('.log')) {
                const filePath = path.join(this.logDir, file);
                const stats = fs.statSync(filePath);

                // Calcula a diferença em dias entre agora e a última modificação do arquivo
                const diffInMs = now.getTime() - stats.mtime.getTime();
                const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

                if (diffInDays > daysToKeep) {
                    fs.unlinkSync(filePath);
                    deletedFiles.push(file);
                }
            }
        });

        return {
            deleted: deletedFiles,
            count: deletedFiles.length
        };
    }
}
