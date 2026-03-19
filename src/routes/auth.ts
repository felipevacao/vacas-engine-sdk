import express from 'express';
import { tokenMiddleware, checkExistingResetToken, resetTokenMiddleware } from '@middlewares/token';
import { UserExpressAdapter } from '@dynamic-modules/adapters/userExpress.adapter';
import { AuthUserSessionWorkflow } from 'workflows/AuthUserSession';
import { UserService } from '@dynamic-modules/services/user';

const router = express.Router();

const userService = new UserService()
const authWorkflow = new AuthUserSessionWorkflow(userService)
const userExpressAdapter = new UserExpressAdapter(userService, authWorkflow);


router.post('/login', userExpressAdapter.login.bind(userExpressAdapter));

router.get('/logout', tokenMiddleware, userExpressAdapter.logout.bind(userExpressAdapter));

router.get('/me', tokenMiddleware, userExpressAdapter.getMe.bind(userExpressAdapter));

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
 * Rota para atualizar a senha durante a sessão do usuário
 * @Bearer tokenSession
 * @body type PasswordChangeRequest
 */
router.patch('/password', tokenMiddleware, userExpressAdapter.updatePassword.bind(userExpressAdapter));


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
router.post('/password/forgot', userExpressAdapter.forgotPassword.bind(userExpressAdapter))

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
router.patch('/password/reset', resetTokenMiddleware, userExpressAdapter.resetPassword.bind(userExpressAdapter))


export default router;