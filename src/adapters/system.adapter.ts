import { Request, Response } from 'express';
import { SystemService } from '@services/system';
import { ResponseHandler } from '@utils/responseHandler';
import { asyncHandler } from '@utils/asyncHandler';

export class SystemAdapter {
    private service = new SystemService();

    /**
     * Obtém o conteúdo de um log específico pela data.
     * GET /system/logs/:date?type=error
     */
    getLog = asyncHandler(async (req: Request, res: Response) => {
        const { date } = req.params;
        const { type } = req.query;

        const content = await this.service.getLogByDate(
            date,
            (type as 'error' | 'access') || 'error'
        );

        ResponseHandler.success(res, {
            date,
            type: type || 'error',
            content
        });
    });

    /**
     * Lista todos os nomes de arquivos de log disponíveis.
     * GET /system/logs
     */
    listLogs = asyncHandler(async (req: Request, res: Response) => {
        const logs = await this.service.listAvailableLogs();
        ResponseHandler.success(res, { logs });
    });
}
