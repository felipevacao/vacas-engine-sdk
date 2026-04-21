import path from 'path';
import dotenv from 'dotenv';
import { cleanEnv, str } from "envalid";

// 1. Tenta carregar do diretório de trabalho atual (CWD)
dotenv.config();

// 2. Tenta carregar de caminhos conhecidos baseados na estrutura do projeto
// __dirname em src/libs/env.ts -> packages/verona/src/libs
// __dirname em dist/libs/env.js -> packages/verona/dist/libs
const isDist = __dirname.includes('dist');
const projectRoot = isDist
    ? path.resolve(__dirname, '../../../') // sobe de dist/libs para packages/verona
    : path.resolve(__dirname, '../../');    // sobe de src/libs para packages/verona

const envFiles = ['.env', '.env.production', '.env.development', '.env.local'];

for (const file of envFiles) {
    dotenv.config({ path: path.join(projectRoot, file) });
}

/**
 * Carrega e valida as variáveis de ambiente usando a biblioteca envalid.
 */
const env = cleanEnv(
    process.env,
    {
        NODE_ENV: str({ choices: ['development', 'production', 'test'], default: 'development' }),
        SDK_NAME: str({ default: 'Verona' }),
        SDK_VERSION: str({ default: '0.0.1' }),
        API_CLIENT: str({ default: 'treis' }),
        // Conexão com o Treis
        TREIS_API_URL: str({ default: 'http://treisapi:3002', desc: 'URL da API do Treis' }),
        INTERNAL_API_KEY: str({ desc: 'Chave secreta para comunicação interna' }),
    }
)

export default env;
