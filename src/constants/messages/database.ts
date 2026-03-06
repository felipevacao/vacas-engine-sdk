export const DATABASE_MESSAGES = {
	// Conexão
	CONNECTION: {
		SUCCESS: 'Conexão com o banco de dados estabelecida com sucesso!',
		ERROR: 'Erro ao conectar ao banco de dados!'
	},

} as const;

// Type para as mensagens (útil para autocomplete no TypeScript)
export type DatabaseMessages = typeof DATABASE_MESSAGES;

// Export individual categories for more granular imports
export const {
	CONNECTION
} = DATABASE_MESSAGES;