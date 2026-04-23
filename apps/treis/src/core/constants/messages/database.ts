export const DATABASE = {
	// Conexão
	CONNECTION: {
		SUCCESS: {
			name: 'SUCCESS',
			message: 'Conexão com o banco de dados estabelecida com sucesso!'
		},
		ERROR: {
			name: 'ERROR',
			message: 'Erro ao conectar ao banco de dados!'
		},
	},
	ENTITY: {
		CREATED: {
			name: 'CREATED',
			message: 'Entidade criada com sucesso!'
		},
		CREATED_ERROR: {
			name: 'CREATED_ERROR',
			message: 'Erro ao criar entidade!'
		},
		READ_ERROR: {
			name: 'READ_ERROR',
			message: 'Erro ao buscar entidade!'
		},
		UPDATED: {
			name: 'UPDATED',
			message: 'Entidade atualizada com sucesso!'
		},
		UPDATE_ERROR: {
			name: 'UPDATE_ERROR',
			message: 'Erro ao atualizar entidade!'
		},
		DELETED: {
			name: 'DELETED',
			message: 'Entidade deletada com sucesso!'
		},
		DELETE_ERROR: {
			name: 'DELETE_ERROR',
			message: 'Erro ao deletar entidade!'
		},
		RESTORED: {
			name: 'RESTORED',
			message: 'Entidade restaurada com sucesso!'
		},
		RESTORE_ERROR: {
			name: 'RESTORE_ERROR',
			message: 'Erro ao restaurar entidade!'
		},
		NOT_FOUND: {
			name: 'NOT_FOUND',
			message: 'Entidade não encontrada!'
		},
		METADATA_NOT_FOUND: {
			name: 'METADATA_NOT_FOUND',
			message: 'Metadata não encontrada!'
		},
		INVALID_ID: {
			name: 'INVALID_ID',
			message: 'Formato inválido no ID'
		},
	},
	LOGIN: {
		SUCCESS: {
			name: 'SUCCESS',
			message: 'Login realizado com sucesso'
		},
		ACTIVE_SESSION: {
			name: 'ACTIVE_SESSION',
			message: 'Sessão ativa!'
		},
		INVALID_SESSION: {
			name: 'INVALID_SESSION',
			message: 'Sessão inválida!'
		},
	}

}

// Type para as mensagens (útil para autocomplete no TypeScript)
export type DatabaseMessages = typeof DATABASE;

// Export individual categories for more granular imports
export const {
	CONNECTION,
	ENTITY,
	LOGIN
} = DATABASE;