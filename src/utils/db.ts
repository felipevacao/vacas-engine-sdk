// api/src/utils/db.ts
import { Pool, PoolConfig } from 'pg';

// Configurações do banco de dados
const dbConfig: PoolConfig = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432', 10), // Converte a porta para número
};

// Cria uma instância do Pool (conexão com o banco de dados)
const pool = new Pool(dbConfig);

// Exporta o pool para ser usado em outros arquivos
export default pool;