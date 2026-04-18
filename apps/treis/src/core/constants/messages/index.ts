import { DATABASE } from './database';
import { ERROR } from './errorCodes';
import env from '@libs/env';

const rawMessages = {
	API: {
		START: {
			name: 'START',
			message: `${env.API_NAME} iniciada com sucesso!`
		},
		ERROR: {
			name: 'ERROR',
			message: `${env.API_NAME} - Erro ao iniciar a API!`
		},
		HOME: {
			name: 'HOME',
			message: `${env.API_NAME} está funcionando!`
		},
		INIT_PORT: {
			name: 'INIT_PORT',
			message: 'Servidor rodando na porta'
		},
		SUCCESS: {
			name: 'SUCCESS',
			message: 'Operação realizada com sucesso'
		},
		SUCCESS_DATA: {
			name: 'SUCCESS_DATA',
			message: 'Dados obtidos com sucesso'
		},
		PASSWORD_CHANGED: {
			name: 'PASSWORD_CHANGED',
			message: 'Senha alterada com sucesso! Favor realizar Login novamente!'
		}
	},
	ROUTES: {
		LIST: {
			name: 'LIST',
			message: 'Rotas registradas:'
		},
		ERROR: {
			name: 'ERROR',
			message: 'Erro ao carregar rotas:'
		},
	},
	DATABASE,
	ERROR
}

export const MESSAGES = rawMessages
