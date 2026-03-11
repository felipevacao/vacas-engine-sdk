export const DATABASE_MESSAGES = {
	// Conexão
	CONNECTION: {
		SUCCESS: 'Conexão com o banco de dados estabelecida com sucesso!',
		ERROR: 'Erro ao conectar ao banco de dados!',
	},
	ENTITY: {
		CREATED: 'Entidade criada com sucesso!',
		CREATED_ERROR: 'Erro ao criar entidade!',
		READ_ERROR: 'Erro ao buscar entidade!',
		UPDATED: 'Entidade atualizada com sucesso!',
		UPDATE_ERROR: 'Erro ao atualizar entidade!',
		DELETED: 'Entidade deletada com sucesso!',
		DELETE_ERROR: 'Erro ao deletar entidade!',
		NOT_FOUND: 'Entidade não encontrada!',
		METADATA_NOT_FOUND: 'Metadata não encontrada!'
	},
	LOGIN: {
		SUCCESS: 'Login realizado com sucesso'
	}

} as const;

// Type para as mensagens (útil para autocomplete no TypeScript)
export type DatabaseMessages = typeof DATABASE_MESSAGES;

// Export individual categories for more granular imports
export const {
	CONNECTION,
	ENTITY
} = DATABASE_MESSAGES;