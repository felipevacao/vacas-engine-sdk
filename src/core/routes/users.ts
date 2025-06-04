import express from 'express';
import { UsersController } from '@core/controllers/UsersController';
import { UserExpressAdapter } from '@core/adapters/userExpress.adapter';

const router = express.Router();
const usersController = new UsersController();
const userExpressAdapter = new UserExpressAdapter(usersController);

// C
router.post('/', userExpressAdapter.create.bind(userExpressAdapter));

// R
router.get('/', userExpressAdapter.findAll.bind(userExpressAdapter));
router.get('/:id', userExpressAdapter.findById.bind(userExpressAdapter));

router.post('/login', userExpressAdapter.login.bind(userExpressAdapter));

// U
router.put('/:id', userExpressAdapter.update.bind(userExpressAdapter));

// D
router.delete('/:id', userExpressAdapter.delete.bind(userExpressAdapter));
router.delete('/force/:id', userExpressAdapter.forceDelete.bind(userExpressAdapter));

export default router;