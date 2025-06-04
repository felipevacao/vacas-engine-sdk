import type { Knex } from 'knex'
import { knexSnakeCaseMappers } from 'objection'
import env from "@lib/env"

// Configurações do banco de dados
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