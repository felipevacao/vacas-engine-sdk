import './alias'
import env from "@libs/env"
import express from 'express'
import router from "./routes/index"
import cors from 'cors'
import { MESSAGES } from '@constants';
import rateLimit from 'express-rate-limit';
import { Logger, getMessage } from '@utils';
import helmet from 'helmet'
import { GrpcServer } from './grpc'

/**
 * Prevenção de quebra da API por erros não capturados
 */
process.on('uncaughtException', (error) => {
	Logger.error('FALHA CRÍTICA (uncaughtException)', error);
});

process.on('unhandledRejection', (reason) => {
	Logger.error('FALHA CRÍTICA (unhandledRejection)', reason);
});

/**
 * Configuração do servidor Express
 */
const app = express()

// Ativa o Helmet
app.use(helmet({
	contentSecurityPolicy: {
		directives: {
			...helmet.contentSecurityPolicy.getDefaultDirectives(),
			"img-src": ["'self'", "data:", "https://validator.swagger.io"],
			"script-src": ["'self'", "'unsafe-inline'"],
			"style-src": ["'self'", "https:", "'unsafe-inline'"],
		}
	}
}));

// Definindo o rate limit global
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 100,
	message: {
		error: 'Muitas requisições. Tente novamente mais tarde.',
		status: 429
	},
	standardHeaders: true,
	legacyHeaders: false,
});

app.use(limiter);

app.use(cors({
	origin: env.ORIGIN,
	methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key']
}))

app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use(router)

/**
 * Inicialização Condicional
 */
if (env.ENABLE_REST) {
	const port = env.API_PORT
	app.listen(
		port,
		() => {
			console.log(`[INFO] [Express] ${getMessage(MESSAGES.API.INIT_PORT)} ${port}`)
		}
	)
} else {
	console.log('[INFO] [Express] Serviço REST desabilitado.');
}

if (env.ENABLE_GRPC) {
	const grpcServer = new GrpcServer(50051);
	grpcServer.start();
} else {
	console.log('[INFO] [gRPC] Serviço gRPC desabilitado.');
}

console.log(`${getMessage(MESSAGES.API.START)}`)
