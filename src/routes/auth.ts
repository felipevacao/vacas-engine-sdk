import express from 'express';
import { tokenMiddleware, checkExistingToken } from '@middlewares/token';
import { AuthController } from '@controllers/AuthController';
import { UserExpressAdapter } from '@dynamic-modules/adapters/userExpress.adapter';
import { MESSAGES } from '@constants/messages/index';

const router = express.Router();

const authController = new AuthController();
const userExpressAdapter = new UserExpressAdapter(authController);

/**
 * Rota de login
 * Recebe as credenciais do usuário, autentica e retorna um token de acesso.
 * O método bind é usado para garantir que o contexto (this) dentro do método login
 * seja o da instância do UserExpressAdapter, permitindo o acesso correto aos seus métodos e propriedades.
 */
router.post('/login', userExpressAdapter.login.bind(userExpressAdapter));

/**
 * Esta rota é usada para verificar se um token de autenticação já existe e é válido.
 * Essa rota pode ser útil para testar a funcionalidade de verificação de token antes de acessar rotas protegidas.
 */
router.get('/check', checkExistingToken, (req, res) => {
	res.status(401).json({
		success: false,
		error: MESSAGES.ERROR_CODES.MISSING_TOKEN,
		code: 'LOGIN_ERROR'
	})
})

/**
 * Rota para obter metadados de senha
 * Esta rota é protegida pelo tokenMiddleware, que valida o token de autenticação antes de permitir o acesso.
 * Retorna um objeto JSON com os campos currentPassword e newPassword, que são strings.
 * Esses campos podem ser usados para exibir informações sobre a senha atual e a nova senha que o usuário deseja definir.
 */
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
 * Rota para atualizar a senha
 * Esta rota é protegida pelo tokenMiddleware, que valida o token de autenticação antes de permitir o acesso.
 * Recebe os dados da nova senha e a atualiza no sistema.
 */
router.patch('/password', tokenMiddleware, userExpressAdapter.updatePassword.bind(userExpressAdapter));

/**
 * Rota para logout
 * Esta rota é protegida pelo tokenMiddleware, que valida o token de autenticação antes de permitir o acesso.
 * Invalida o token de acesso do usuário.
 */
router.get('/logout', tokenMiddleware, userExpressAdapter.logout.bind(userExpressAdapter));

export default router;