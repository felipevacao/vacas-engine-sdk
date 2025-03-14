import express from 'express';
import { UserController } from '../../controllers/userController';

const router = express.Router();
const userController = new UserController();

router.post('/', userController.create.bind(userController));
router.get('/', userController.findAll.bind(userController));
router.get('/:id', userController.findById.bind(userController));

export default router;