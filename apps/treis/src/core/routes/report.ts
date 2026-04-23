import { Router } from 'express';
import { ReportExpressAdapter } from '@adapters';
import { tokenMiddleware } from '@middlewares';
import { reportRegistry } from '@services';
import { ResponseHandler } from '@utils';

const router = Router();
const adapter = new ReportExpressAdapter();

router.post('/:reportId', tokenMiddleware, adapter.handle);

router.get('/', tokenMiddleware, (req, res) => {
	const catalog = reportRegistry.getCatalog()
	ResponseHandler.success(res, catalog)
})


export default router;
