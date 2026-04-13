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
        // Identificação da API
        API_NAME: str({ default: 'API Treis' }),
        API_VERSION: str({ default: '1.0.0' }),
        NODE_ENV: str({ choices: ['development', 'production', 'test'], default: 'development' }),

        // Banco de Dados (OBRIGATÓRIOS para o Motor)
        DB_USER: str(),
        DB_PASS: str(),
        DB_NAME: str(),
        DB_HOST: str(),
        DB_PORT: port({ default: 5432 }),

        // Servidor
        API_PORT: port({ default: 3002 }),
        ORIGIN: str({ default: 'http://localhost' }),

        // Segurança e Criptografia (OBRIGATÓRIOS)
        PEPPER_VERSIONS: str({ desc: 'JSON com versões de pepper para senhas' }),
        PEPPER_CURRENT: str({ desc: 'Versão atual do pepper' }),
        SALT_ROUNDS: port({ default: 10 }),

        // Tokens e gRPC (OBRIGATÓRIOS)
        TOKEN_BYTES: str({ default: '32' }),
        TOKEN_ALGOR: str({ default: 'sha256' }),
        TOKEN_PEPPER: str({ desc: 'Pepper para geração de tokens de sessão' }),
        INTERNAL_API_KEY: str({ desc: 'Chave secreta para comunicação gRPC interna' }),

        // Flags de Funcionalidade
        ENABLE_TEST_ROUTES: bool({ default: false }),
        ENABLE_HATEOAS: bool({ default: true }),
        ENABLE_RETURN_ERRORS: bool({ default: false }),
        ENABLE_CONSOLE_LOG: bool({ default: true }),
    }
)

export default env