// api/src/routes/test.ts
import express, { Request, Response } from 'express';
import pool from '../utils/db';
import { enableTestRoute } from "../middlewares/enableRoute"
import { errorHandler } from "../middlewares/errorHandlers"

const router = express.Router();

router.get('/db', enableTestRoute, async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({
      message: 'Conexão com o banco de dados estabelecida com sucesso!',
      timestamp: result.rows[0].now,
    });
  } catch (err) {
    const error = new Error('Erro ao conectar ao banco de dados! ' + err);
    errorHandler(error, req, res);
  }
});

export default router;