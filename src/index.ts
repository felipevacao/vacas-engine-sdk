// Importação de módulos
import './alias'

import env from "./lib/env"
import express from 'express'
import "./types/express"
import router from "./routes/index"
import cors from 'cors'

// Configurações do servidor
const app = express()

app.use(cors({
  origin: env.ORIGIN, // Permitir requisições do frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

const port = 3015 //env.API_PORT

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use(router)



// Inicialização do servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`)
})