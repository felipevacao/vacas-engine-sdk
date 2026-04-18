import express from 'express';
import { AuthUserSessionWorkflow } from '@workflows';
import { tokenMiddleware, checkExistingResetToken, resetTokenMiddleware } from '@middlewares';
import { UserExpressAdapter, UserService } from '@core-modules/users';


/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Autenticação e Sessão
 */

const router = express.Router();

const userService = new UserService()
const authWorkflow = new AuthUserSessionWorkflow(userService)
const userExpressAdapter = new UserExpressAdapter(userService, authWorkflow);

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registra um novo usuário
 *     description: Se for o primeiro usuário do sistema, ele será criado como administrador.
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - login
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               login:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuário registrado e logado com sucesso
 */
router.post('/register', userExpressAdapter.register.bind(userExpressAdapter));

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Realiza login do usuário
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 */
router.post('/login', userExpressAdapter.login.bind(userExpressAdapter));

/**
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: Realiza logout da sessão atual
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logout realizado
 */
router.get('/logout', tokenMiddleware, userExpressAdapter.logout.bind(userExpressAdapter));

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Obtém dados do usuário logado
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Dados do perfil retornado
 */
router.get('/me', tokenMiddleware, userExpressAdapter.getMe.bind(userExpressAdapter));

/**
 * @swagger
 * /auth/refresh:
 *   get:
 *     summary: Atualiza o token da sessão
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Novo token gerado
 */
router.get('/refresh', tokenMiddleware, userExpressAdapter.refreshSession.bind(userExpressAdapter));

// TROCAR SENHA OU RESETAR
router.get('/password/metadata', tokenMiddleware, (req, res) => {
	res.json({
		success: true,
		data: {
			"currentPassword": "string",
			"newPassword": "string",
		},
	})
})

/**
 * @swagger
 * /auth/password:
 *   patch:
 *     summary: Altera a senha do usuário logado
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Senha alterada com sucesso
 */
router.patch('/password', tokenMiddleware, userExpressAdapter.updatePassword.bind(userExpressAdapter));


/**
 * @swagger
 * /auth/password/forgot:
 *   post:
 *     summary: Solicita recuperação de senha
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: E-mail de recuperação enviado
 */
router.post('/password/forgot', userExpressAdapter.forgotPassword.bind(userExpressAdapter))

/**
 * @swagger
 * /auth/check/token={token}:
 *   get:
 *     summary: Valida token de reset de senha
 *     tags: [Auth]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Token válido
 */
router.get('/check/token=:token', checkExistingResetToken)

/**
 * @swagger
 * /auth/password/reset:
 *   patch:
 *     summary: Define nova senha após validação do token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Senha resetada com sucesso
 */
router.patch('/password/reset', resetTokenMiddleware, userExpressAdapter.resetPassword.bind(userExpressAdapter))


export default router;