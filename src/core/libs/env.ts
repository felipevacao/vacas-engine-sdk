import "dotenv/config";
import { cleanEnv, str, port, bool } from "envalid";

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
        DB_USER: str(),
        DB_PASS: str(),
        DB_NAME: str(),
        DB_HOST: str(),
        DB_PORT: port({ default: 5432 }),
        API_PORT: port({ default: 3000 }),
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