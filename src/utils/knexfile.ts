import type { Knex } from 'knex'
import { knexSnakeCaseMappers } from 'objection'
import env from "@lib/env"

/**
 * Configuração do Knex para conexão com o banco de dados PostgreSQL.
 * A configuração inclui as credenciais de conexão, as opções de migração e os mapeadores de nomenclatura.
 * O objeto de configuração é exportado como padrão para ser usado em outras partes da aplicação.
 */
const config: Knex.Config = {
	client: 'pg',
	connection: {
		host: env.DB_HOST,
		port: env.DB_PORT,
		user: env.DB_USER,
		password: env.DB_PASSWORD,
		database: env.DB_NAME,
	},
	migrations: {
		tableName: 'knex_migrations',
		directory: './migrations',
	},
	...knexSnakeCaseMappers(),
}

export default config