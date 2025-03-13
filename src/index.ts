// api/src/index.ts
import env from "./lib/env"
import express, { Request, Response } from 'express'
import pool from './utils/db'

const app = express()
const port = env.API_PORT

// Middleware para parsear JSON
app.use(express.json())

// Rota de teste de conexão com o banco de dados
app.get('/test-db', async (req: Request, res: Response) => {
  try {
    // Executa uma query simples para testar a conexão
    const result = await pool.query('SELECT NOW()')
    res.json({
      message: 'Conexão com o banco de dados estabelecida com sucesso!',
      timestamp: result.rows[0].now,
    })
  } catch (err) {
    console.error('Erro ao conectar ao banco de dados:', err)
    res.status(500).json({ error: 'Erro ao conectar ao banco de dados' })
  }
})

// Rota de boas-vindas
app.get('/', (req: Request, res: Response) => {
  res.send('API está funcionando! ');
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});