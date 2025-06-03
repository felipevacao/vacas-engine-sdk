import express from 'express';
import { UsersController } from '../../controllers/UsersController';

const router = express.Router();
const usersController = new UsersController();

// C
router.post('/', usersController.create.bind(usersController));

// R
router.get('/', usersController.findAll.bind(usersController));
router.get('/:id', usersController.findById.bind(usersController));

// U
router.put('/:id', usersController.update.bind(usersController));

// D
router.delete('/:id', usersController.delete.bind(usersController));
router.delete('/force/:id', usersController.forceDelete.bind(usersController));

export default router;