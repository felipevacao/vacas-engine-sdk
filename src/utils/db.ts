// api/src/utils/db.ts
import { Pool, PoolConfig } from 'pg'
import env from "@lib/env"
import knex from 'knex'
import config from './knexfile'

// Configurações do banco de dados
const dbConfig: PoolConfig = {
	user: env.DB_USER,
	host: env.DB_HOST,
	database: env.DB_NAME,
	password: env.DB_PASS,
	port: env.DB_PORT || 5432,
}

export const pool = new Pool(dbConfig)
export const db = knex(config)