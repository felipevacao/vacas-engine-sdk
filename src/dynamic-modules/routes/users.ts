import express from 'express';
import { UsersController } from '@dynamic-modules/controllers/users';
import { ExpressAdapter } from '@adapters/express.adapter';
import { tokenMiddleware } from '@middlewares/token';
import { AuthController } from '@controllers/AuthController';
import { UserExpressAdapter } from '@dynamic-modules/adapters/userExpress.adapter';

const router = express.Router();
const usersController = new UsersController();
const expressAdapter = new ExpressAdapter(usersController);

const authController = new AuthController();
const userExpressAdapter = new UserExpressAdapter(authController);

// C
router.post('/', expressAdapter.create.bind(expressAdapter));

// R
router.get('/', expressAdapter.findAll.bind(expressAdapter));
router.get('/:id', expressAdapter.findById.bind(expressAdapter));

// U
router.put('/:id', expressAdapter.update.bind(expressAdapter));

// D
router.delete('/:id', expressAdapter.delete.bind(expressAdapter));
router.delete('/force/:id', expressAdapter.forceDelete.bind(expressAdapter));


router.post('/logout', userExpressAdapter.logout.bind(userExpressAdapter));

export const middleware = [tokenMiddleware];
export default router;