import { DATABASE_MESSAGES } from './database';
import { ERROR_CODES } from './errorCodes';
import env from '@lib/env';

export const MESSAGES = {
	API: {
		START: `${env.API_NAME} iniciada com sucesso!`,
		ERROR: `${env.API_NAME} - Erro ao iniciar a API!`,
		HOME: `${env.API_NAME} está funcionando!`,
		INIT_PORT: 'Servidor rodando na porta'
	},
	ROUTES: {
		LIST: 'Rotas registradas:',
		ERROR: 'Erro ao carregar rotas:'
	},
	DATABASE: DATABASE_MESSAGES,
	ERROR_CODES: ERROR_CODES
} as const;

export type Messages = typeof MESSAGES;