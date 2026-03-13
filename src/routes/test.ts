// api/src/routes/test.ts
import express, { Request, Response } from 'express';
import { db } from '@utils/db';
import { enableTestRoute } from "@middlewares/enableRoute"
import { errorHandler } from "@middlewares/errorHandlers"
import { MESSAGES } from '@constants/messages/index';

const router = express.Router();

/**
 * Rota de teste para verificar a conexão com o banco de dados.
 * Esta rota é protegida por um middleware que verifica se as rotas de teste estão habilitadas no ambiente.
 * Ela executa uma consulta simples para obter a data e hora atual do banco de dados e retorna uma mensagem de sucesso junto com o timestamp.
 * Em caso de erro, ela utiliza o middleware de tratamento de erros para enviar uma resposta adequada.
 */
router.get('/db', enableTestRoute, async (req: Request, res: Response) => {
	try {
		const result = await db.raw('SELECT NOW()');
		res.json({
			message: MESSAGES.DATABASE.CONNECTION.SUCCESS,
			timestamp: result.rows[0].now,
		});
	} catch (err) {
		const error = new Error(MESSAGES.DATABASE.CONNECTION.ERROR + ' ' + err);
		errorHandler(error, req, res);
	}
});

router.get('/script', async (req: Request, res: Response) => {

	const teste = MESSAGES.ERROR.MISSING_TOKEN
	console.log(teste)
	res.json(teste)
})

export default router;