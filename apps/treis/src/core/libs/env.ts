import path from 'path';
import dotenv from 'dotenv';
import { cleanEnv, str, port, bool } from "envalid";

// 1. Tenta carregar do diretório de trabalho atual (CWD)
dotenv.config();

// 2. Tenta carregar de caminhos conhecidos baseados na estrutura do projeto
// __dirname em src/core/libs/env.ts -> apps/treis/src/core/libs
// __dirname em dist/core/libs/env.js -> apps/treis/dist/core/libs
const isDist = __dirname.includes('dist');
const projectRoot = isDist
    ? path.resolve(__dirname, '../../../') // sobe de dist/core/libs para apps/treis
    : path.resolve(__dirname, '../../');    // sobe de src/core/libs para apps/treis

const envFiles = ['.env', '.env.production', '.env.development', '.env.local'];

for (const file of envFiles) {
    dotenv.config({ path: path.join(projectRoot, file) });
}

/**
 * Carrega e valida as variáveis de ambiente usando a biblioteca envalid. As variáveis de ambiente são definidas com seus tipos e valores padrão, 
 * garantindo que a aplicação tenha as configurações necessárias para funcionar corretamente.
 */
const env = cleanEnv(
    process.env,
    {
        API_NAME: str({ default: 'API' }),
        API_VERSION: str({ default: '0.0.1' }),
        NODE_ENV: str({ choices: ['development', 'production', 'test'], default: 'development' }),
        DB_USER: str({ default: process.env.DB_USER }),
        DB_PASS: str({ default: process.env.DB_PASS }),
        DB_NAME: str({ default: process.env.DB_NAME }),
        DB_HOST: str({ default: process.env.DB_HOST }),
        DB_PORT: port({ default: Number(process.env.DB_PORT) || 5432 }),
        API_PORT: port({ default: Number(process.env.API_PORT) || 3000 }),
        ENABLE_TEST_ROUTES: bool({ default: false }),
        ENABLE_HATEOAS: bool({ default: true }),
        ENABLE_RETURN_ERRORS: bool({ default: false }),
        SALT_ROUNDS: port({ default: 10 }),
        ORIGIN: str({ default: 'http://localhost' }),
        PEPPER_VERSIONS: str({ default: '{"1": ""}' }),
        PEPPER_CURRENT: str({ default: '1' }),
        ENABLE_CONSOLE_LOG: bool({ default: false }),

        TOKEN_BYTES: str({ default: '32' }),
        TOKEN_ALGOR: str({ default: 'sha256' }),
        TOKEN_PEPPER: str({ default: '' }),
        INTERNAL_API_KEY: str({ default: 'S3cr3t_K3y_F0r_gRPC_BFF' })
    }
)

export default env