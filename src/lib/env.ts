import { cleanEnv, str, port } from "envalid";

const env = cleanEnv(process.env, {
    DB_USER: str(),
    DB_PASSWORD: str(),
    DB_NAME: str(),
    DB_HOST: str(),
    DB_PORT: port(),
    API_PORT: port()
})

export default env