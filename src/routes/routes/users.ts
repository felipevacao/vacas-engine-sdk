import express from 'express';
import { UsersController } from '../../controllers/UsersController';

const router = express.Router();
const usersController = new UsersController();

router.post('/', usersController.create.bind(usersController));
router.get('/', usersController.findAll.bind(usersController));
router.get('/:id', usersController.findById.bind(usersController));
router.put('/:id', usersController.update.bind(usersController));
router.delete('/:id', usersController.delete.bind(usersController));
router.delete('/force/:id', usersController.forceDelete.bind(usersController));

export default router;