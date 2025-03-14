
import express from 'express';
import { UsersController } from '../../controllers/usersController';

const router = express.Router();
const usersController = new UsersController();

router.post('/', usersController.create.bind(usersController));
router.get('/', usersController.findAll.bind(usersController));
router.get('/:id', usersController.findById.bind(usersController));

export default router;
