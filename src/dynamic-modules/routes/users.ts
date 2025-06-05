import express from 'express';
import { UsersController } from '@dynamic-modules/controllers/UsersController';
import { AuthController } from '@controllers/AuthController';
import { UserExpressAdapter } from '@dynamic-modules/adapters/userExpress.adapter';
import { ExpressAdapter } from '@adapters/express.adapter';

const router = express.Router();
const usersController = new UsersController();
const authController = new AuthController();
const userExpressAdapter = new UserExpressAdapter(authController);
const expressAdapter = new ExpressAdapter(usersController);

// C
router.post('/', expressAdapter.create.bind(expressAdapter));

// R
router.get('/', expressAdapter.findAll.bind(expressAdapter));
router.get('/:id', expressAdapter.findById.bind(expressAdapter));

router.post('/login', userExpressAdapter.login.bind(userExpressAdapter));

// U
router.put('/:id', expressAdapter.update.bind(expressAdapter));

// D
router.delete('/:id', expressAdapter.delete.bind(expressAdapter));
router.delete('/force/:id', expressAdapter.forceDelete.bind(expressAdapter));

export default router;