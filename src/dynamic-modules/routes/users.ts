import express from 'express';
import { tokenMiddleware } from '@middlewares/token';
import { UserService } from '@dynamic-modules/services/user';
import { AuthUserSessionWorkflow } from 'workflows/AuthUserSession';
import { UserExpressAdapter } from '@dynamic-modules/adapters/userExpress.adapter';

const router = express.Router();

const userService = new UserService()
const authWorkflow = new AuthUserSessionWorkflow(userService)
const expressAdapter = new UserExpressAdapter(userService, authWorkflow);

// C
router.post('/', expressAdapter.create.bind(expressAdapter));

// R
router.get('/metadata', expressAdapter.metadata.bind(expressAdapter))
router.get('/search', expressAdapter.findBy.bind(expressAdapter));
router.get('/', expressAdapter.findAll.bind(expressAdapter));
router.get('/:id', expressAdapter.findById.bind(expressAdapter));


// U
router.patch('/:id', expressAdapter.update.bind(expressAdapter));


// D
router.delete('/:id', expressAdapter.delete.bind(expressAdapter));
router.delete('/force/:id', expressAdapter.forceDelete.bind(expressAdapter));

export const middleware = [tokenMiddleware];
export default router;