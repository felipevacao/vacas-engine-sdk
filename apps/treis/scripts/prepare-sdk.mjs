import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sdkRoot = path.resolve(__dirname, '../');
const rootPath = path.resolve(sdkRoot, '../../');

const log = (msg) => console.log(`\x1b[32m[SDK-PREPARE]\x1b[0m ${msg}`);

function prepare() {
    const sourceScriptsDir = path.join(rootPath, 'apps/treis/scripts');
    const targetScriptsDir = path.join(sdkRoot, 'scripts');

    const filesToSync = ['generate-entity.mjs'];
    const dirsToSync = ['base'];

    log('Sincronizando scripts e templates do Core...');

    // Sincroniza arquivos individuais
    filesToSync.forEach(file => {
        const src = path.join(sourceScriptsDir, file);
        const dest = path.join(targetScriptsDir, file);
        if (fs.existsSync(src)) {
            fs.copyFileSync(src, dest);
            log(`Arquivo sincronizado: ${file}`);
        }
    });

    // Sincroniza pastas (templates)
    dirsToSync.forEach(dir => {
        const srcDir = path.join(sourceScriptsDir, dir);
        const destDir = path.join(targetScriptsDir, dir);
        
        if (fs.existsSync(srcDir)) {
            if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
            
            const templates = fs.readdirSync(srcDir);
            templates.forEach(template => {
                fs.copyFileSync(path.join(srcDir, template), path.join(destDir, template));
            });
            log(`Pasta de templates sincronizada: ${dir}/`);
        }
    });
}

prepare();
log('Preparação concluída.');
