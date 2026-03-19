import express from 'express';
import { tokenMiddleware } from '@middlewares/token';
import { UserService } from '@dynamic-modules/services/user';
import { AuthUserSessionWorkflow } from 'workflows/AuthUserSession';
import { UserExpressAdapter } from '@dynamic-modules/adapters/userExpress.adapter';
import { verifyAdmin, verifySameUser } from '@dynamic-modules/middlewares/users';

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
router.patch('/:id', verifySameUser, expressAdapter.update.bind(expressAdapter));
router.patch('/update/:id', verifyAdmin, expressAdapter.updateUser.bind(expressAdapter));


// D
router.delete('/:id', verifyAdmin, expressAdapter.delete.bind(expressAdapter));
router.delete('/force/:id', verifyAdmin, expressAdapter.forceDelete.bind(expressAdapter));

export const middleware = [tokenMiddleware];
export default router;