import "dotenv/config";
import { cleanEnv, str, port, bool } from "envalid";

const env = cleanEnv(process.env, {
    DB_USER: str(),
    DB_PASSWORD: str(),
    DB_NAME: str(),
    DB_HOST: str(),
    DB_PORT: port(),
    API_PORT: port(),
    ENABLE_TEST_ROUTES: bool({ default: false }),
})

export default env