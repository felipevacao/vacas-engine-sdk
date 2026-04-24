/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: Geração e consulta de relatórios dinâmicos
 */
import { Router } from 'express';
import { ReportExpressAdapter } from '@adapters';
import { tokenMiddleware } from '@middlewares';
import { reportRegistry } from '@services';
import { ResponseHandler } from '@utils';

const router = Router();
const adapter = new ReportExpressAdapter();

/**
 * @swagger
 * /api/reports:
 *   get:
 *     summary: Lista catálogo de relatórios disponíveis
 *     tags: [Reports]
 *     responses:
 *       200:
 *         description: Catálogo de relatórios retornado com sucesso
 */
router.get('/', tokenMiddleware, (req, res) => {
	const catalog = reportRegistry.getCatalog()
	ResponseHandler.success(res, catalog)
})

/**
 * @swagger
 * /api/reports/{reportId}:
 *   post:
 *     summary: Gera relatório via POST (suporta filtros complexos no body)
 *     tags: [Reports]
 *     parameters:
 *       - in: path
 *         name: reportId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Relatório gerado com sucesso
 *   get:
 *     summary: Gera relatório via GET (suporta filtros via query string)
 *     tags: [Reports]
 *     parameters:
 *       - in: path
 *         name: reportId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Relatório gerado com sucesso
 */
router.post('/:reportId', tokenMiddleware, adapter.handle);
router.get('/:reportId', tokenMiddleware, adapter.handle);

export default router;
