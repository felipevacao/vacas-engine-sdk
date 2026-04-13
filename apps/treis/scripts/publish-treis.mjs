import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

const USERNAME = 'felipetrevenzoli';
const ENGINE_IMAGE = `${USERNAME}/treis-engine:latest`;
const DB_IMAGE = `${USERNAME}/treis-db:latest`;

const log = (msg) => console.log(`\x1b[34m[TREIS-PUBLISH]\x1b[0m ${msg}`);
const error = (msg) => console.error(`\x1b[31m[ERROR]\x1b[0m ${msg}`);

try {
    // 1. Validar se estamos na pasta correta
    if (!fs.existsSync(path.resolve(process.cwd(), 'Dockerfile.engine'))) {
        throw new Error('Este script deve ser executado de dentro da pasta apps/treis');
    }

    log(`Iniciando atualização das imagens do sistema Treis para: ${USERNAME}...`);

    // 2. Build e Push do Banco de Dados (DNA do Core)
    log(`Construindo imagem do Banco: ${DB_IMAGE}...`);
    execSync(`docker build -t ${DB_IMAGE} -f Dockerfile.db .`, { stdio: 'inherit' });

    log(`Fazendo push da imagem do Banco...`);
    execSync(`docker push ${DB_IMAGE}`, { stdio: 'inherit' });

    // 3. Build e Push da Engine (Core Builder)
    log(`Construindo imagem da Engine: ${ENGINE_IMAGE}...`);
    execSync(`docker build -t ${ENGINE_IMAGE} -f Dockerfile.engine .`, { stdio: 'inherit' });

    log(`Fazendo push da imagem da Engine...`);
    execSync(`docker push ${ENGINE_IMAGE}`, { stdio: 'inherit' });

    log(`\x1b[32m✅ SUCESSO!\x1b[0m O sistema Treis foi atualizado no Docker Hub.`);
    log(`Imagens atualizadas:`);
    log(` - ${DB_IMAGE}`);
    log(` - ${ENGINE_IMAGE}`);

} catch (err) {
    error(`Falha ao publicar imagens: ${err.message}`);
    process.exit(1);
}
