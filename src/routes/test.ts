// api/src/routes/test.ts
import express, { Request, Response } from 'express';
import { db } from '../utils/db';
import { enableTestRoute } from "../middlewares/enableRoute"
import { errorHandler } from "../middlewares/errorHandlers"

const router = express.Router();

router.get('/health', enableTestRoute, async (req: Request, res: Response) => {
  try {
    const result = await db.raw('SELECT NOW()');
    res.json({
      message: 'Conexão com o banco de dados usando knex estabelecida com sucesso!',
      timestamp: result.rows[0].now,
    });
  } catch (err) {
    const error = new Error('Erro ao conectar ao banco de dados! ' + err);
    errorHandler(error, req, res);
  }
});

export default router;