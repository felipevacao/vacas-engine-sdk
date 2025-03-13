// api/src/utils/db.ts
import { Pool, PoolConfig } from 'pg';
import env from "../lib/env";

const dbConfig: PoolConfig = {
  user: env.DB_USER,
  host: env.DB_HOST,
  database: env.DB_NAME,
  password: env.DB_PASSWORD,
  port: env.DB_PORT || 5432,
};

/**
 * Cria a conexão com o banco de dados e exporta
 */
const pool = new Pool(dbConfig);
export default pool;