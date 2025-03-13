// api/src/index.ts
import env from "./lib/env"
import express from 'express'
import router from "./routes/index"

const app = express()
const port = env.API_PORT

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(router)

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`)
})