// api/src/utils/db.ts
import { Pool, PoolConfig } from 'pg'
import env from "@libs/env"
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

// const instance = knex(config);

// // Log explícito de erro de conexão inicial
// instance.raw('SELECT 1')
// 	.then(() => console.log('--- [DB] CONEXÃO BEM SUCEDIDA ---'))
// 	.catch((err) => {
// 		console.error('--- [DB] FALHA CRÍTICA AO CONECTAR ---');
// 		console.error('Erro:', err.message);
// 		console.error('Stack:', err.stack);

// 	});

// export const db = instance;