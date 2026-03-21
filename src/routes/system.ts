import express from 'express';
import { SystemAdapter } from '@adapters/system.adapter';
import { tokenMiddleware } from '@middlewares/token';
import { verifyAdmin } from '@dynamic-modules/middlewares/users';

const router = express.Router();
const adapter = new SystemAdapter();

/**
 * Rotas administrativas do sistema
 * Todas protegidas por token e nível de acesso admin
 */

// Listar arquivos de log disponíveis
router.get('/logs', adapter.listLogs);

// Obter conteúdo de um log por data (ex: /system/logs/2026-03-20)
router.get('/logs/:date', adapter.getLog);

export const middleware = [tokenMiddleware, verifyAdmin];
export default router;
