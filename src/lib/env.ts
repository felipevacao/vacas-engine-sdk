import "dotenv/config";
import { cleanEnv, str, port, bool } from "envalid";

/**
 * Environment variables configuration for the application.
 * This module uses `envalid` to validate and clean environment variables.
 * It ensures that required variables are present and have the correct types.
 */
const env = cleanEnv(
    process.env, 
    {
        DB_USER: str(),
        DB_PASSWORD: str(),
        DB_NAME: str(),
        DB_HOST: str(),
        DB_PORT: port({ default: 5432 }),
        API_PORT: port({ default: 3000 }),
        ENABLE_TEST_ROUTES: bool({ default: false }),
        ENABLE_HATEOAS: bool({ default: true }),
        ENABLE_RETURN_ERRORS: bool({ default: false }),
        SALT_ROUNDS: port({ default: 10 }),
        ORIGIN: str({ default: 'http://localhost' })
    }
)

export default env