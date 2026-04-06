import express from 'express';
import { tokenMiddleware } from '@middlewares/token';
import { UserService } from '@dynamic-modules/services/user';
import { AuthUserSessionWorkflow } from '@workflows/AuthUserSession';
import { UserExpressAdapter } from '@dynamic-modules/adapters/express/userExpress.adapter';
import { verifyAdmin, verifySameUser } from '@dynamic-modules/middlewares/users';

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gerenciamento de usuários
 */

const router = express.Router();

const userService = new UserService()
const authWorkflow = new AuthUserSessionWorkflow(userService)
const expressAdapter = new UserExpressAdapter(userService, authWorkflow);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Cria um novo usuário
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Users'
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *   get:
 *     summary: Lista todos os usuários
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Lista de usuários retornada
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Users'
 */
router.post('/', verifyAdmin, expressAdapter.create.bind(expressAdapter));

/**
 * @swagger
 * /users/metadata:
 *   get:
 *     summary: Obtém metadados da entidade usuários
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Metadados retornados
 */
router.get('/metadata', expressAdapter.metadata.bind(expressAdapter))

/**
 * @swagger
 * /users/search:
 *   get:
 *     summary: Busca usuários com filtros
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Resultados da busca
 */
router.get('/search', verifyAdmin, expressAdapter.findBy.bind(expressAdapter));

router.get('/', verifyAdmin, expressAdapter.findAll.bind(expressAdapter));

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Obtém um usuário pelo ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *   patch:
 *     summary: Atualiza um usuário (próprio perfil)
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuário atualizado
 *   delete:
 *     summary: Marca um usuário (Admin) como deletado
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuário removido
 */
router.get('/:id', expressAdapter.findById.bind(expressAdapter));


// U
router.patch('/:id', verifySameUser, expressAdapter.update.bind(expressAdapter));

/**
 * @swagger
 * /users/update/{id}:
 *   patch:
 *     summary: Atualiza um usuário (Admin)
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuário atualizado pelo admin
 */
router.patch('/update/:id', verifyAdmin, expressAdapter.updateUser.bind(expressAdapter));


// D
router.delete('/:id', verifyAdmin, expressAdapter.delete.bind(expressAdapter));

/**
 * @swagger
 * /users/force/{id}:
 *   delete:
 *     summary: Remove permanentemente um usuário (Admin)
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuário removido permanentemente
 */
router.delete('/force/:id', verifyAdmin, expressAdapter.forceDelete.bind(expressAdapter));

export const middleware = [tokenMiddleware];
export default router;