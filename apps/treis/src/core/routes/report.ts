import { Router } from 'express';
import { ReportExpressAdapter } from '@adapters';
import { tokenMiddleware } from '@middlewares';

const router = Router();
const adapter = new ReportExpressAdapter();

router.post('/:reportId', tokenMiddleware, adapter.handle);

export default router;
