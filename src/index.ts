// Importação de módulos
import 'tsconfig-paths/register'; 
import env from "./lib/env"
import express from 'express'
import router from "./routes/index"

// Configurações do servidor
const app = express()
const port = env.API_PORT

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use(router)

// Inicialização do servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`)
})