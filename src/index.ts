import './alias'
import env from "./lib/env"
import express from 'express'
import "./types/express"
import router from "./routes/index"
import cors from 'cors'
import { MESSAGES } from '@constants/messages/index';
import rateLimit from 'express-rate-limit';

/**
 * Configuração do servidor Express
 */
const app = express()


// Definindo o rate limit global
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutos
	max: 100, // Limite de 100 requisições por IP
	message: {
		error: 'Muitas requisições. Tente novamente mais tarde.',
		status: 429
	},
	standardHeaders: true, // Retorna headers com info do rate limit
	legacyHeaders: false,
});

// Aplicar a todas as rotas
app.use(limiter);

/**
 * Configuração do CORS
 * Especificar a origem permitida para evitar problemas de CORS
 * Origin deve ser a URL do frontend ou cliente que irá consumir a API 
*/
app.use(cors({
	origin: env.ORIGIN,
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization']
}))

/**
 * Configuração do body-parser
 * Permite que o Express entenda requisições com payload JSON e urlencoded
 */
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

/** 
 * Configuração das rotas
 * Todas as rotas definidas em src/routes/index.ts serão usadas a partir da raiz '/'
 */
app.use(router)

/**
 * Inicia o servidor na porta especificada em env.API_PORT
 * Exibe uma mensagem no console indicando que o servidor está rodando
 */
const port = env.API_PORT
app.listen(
	port,
	() => {
		console.log(MESSAGES.API.START)
		console.log(`${MESSAGES.API.INIT_PORT} ${port}`)
	}
)