import express from 'express';
import { tokenMiddleware, checkExistingResetToken, resetTokenMiddleware } from '@middlewares/token';
import { AuthController } from '@controllers/AuthController';
import { UserExpressAdapter } from '@dynamic-modules/adapters/userExpress.adapter';
import { PasswordExpressAdapter } from '@dynamic-modules/adapters/passwordExpress.adapter';
// import { MESSAGES } from '@constants/messages/index';

const router = express.Router();

const authController = new AuthController();
const userExpressAdapter = new UserExpressAdapter(authController);
const passwordExpressAdapter = new PasswordExpressAdapter(authController);

/**
 * Rota de login
 * Recebe as credenciais do usuário, autentica e retorna um token de acesso.
 * O método bind é usado para garantir que o contexto (this) dentro do método login
 * seja o da instância do UserExpressAdapter, permitindo o acesso correto aos seus métodos e propriedades.
 */
router.post('/login', userExpressAdapter.login.bind(userExpressAdapter));

/**
 * Rota para logout
 * Esta rota é protegida pelo tokenMiddleware, que valida o token de autenticação antes de permitir o acesso.
 * Invalida o token de acesso do usuário.
 */
router.get('/logout', tokenMiddleware, userExpressAdapter.logout.bind(userExpressAdapter));

// TROCAR SENHA OU RESETAR

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
 * Rota para atualizar a senha durante a sessão do usuário
 * @Bearer tokenSession
 * @body type PasswordChangeRequest
 */
router.patch('/password', tokenMiddleware, passwordExpressAdapter.updatePassword.bind(passwordExpressAdapter));


/**
 * FLUXO DE RESET DE SENHA (3 PASSOS OBRIGATÓRIOS):
 * 1. /forgot: gera token (status ACTIVE)
 * 2. /check/token: activateResetSession() valida token e muda status para RESET
 * 3. /reset: validateSessionUser() com status RESET efetua a troca
 * 
 * O usuário só consegue resetar se percorrer os 3 passos em sequência.
 * O status RESET bloqueia login e só permite acesso ao endpoint de reset.
 */

/**
 * gera um token de reset de senha... 'esqueci ou resetar senha'
 * @body type PasswordResetRequest
 * @returns tokenReset
 */
router.post('/password/forgot', passwordExpressAdapter.forgotPassword.bind(passwordExpressAdapter))

/**
 * validação do token de reset de senha
 * @params tokenReset
  */
router.get('/check/token=:token', checkExistingResetToken)

/**
 * reseta a senha
 * @body type PasswordResetRequest
 * @Bearer tokenReset
 */
router.patch('/password/reset', resetTokenMiddleware, passwordExpressAdapter.resetPassword.bind(passwordExpressAdapter))


export default router;