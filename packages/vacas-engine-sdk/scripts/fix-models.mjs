import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sdkRoot = path.resolve(__dirname, '../');
const rootPath = path.resolve(sdkRoot, '../../');
const modulesPath = path.join(sdkRoot, 'src/dynamic-modules');

const log = (msg) => console.log(`\x1b[36m[SDK-FIX]\x1b[0m ${msg}`);

/**
 * Corrige modelos legados para o novo padrão (ex: adicionando campo count)
 */
function fixModels(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            fixModels(fullPath);
        } else if (file === 'model.ts') {
            let content = fs.readFileSync(fullPath, 'utf8');
            
            if (!content.includes('count:')) {
                log(`Corrigindo model em: ${path.relative(sdkRoot, fullPath)}`);
                
                const tableMatch = content.match(/table:\s*['"]([^'"]+)['"]/);
                const entityMatch = content.match(/Model<([^>]+)>/);
                
                if (tableMatch && entityMatch) {
                    const tableName = tableMatch[1];
                    const entityName = entityMatch[1];
                    const countLine = `  count: repository.read<${entityName}>('${tableName}').count,`;
                    
                    content = content.replace(
                        /forceDelete: repository\.forceDelete\('[^']+'\),?/,
                        (match) => `${match}\n${countLine}`
                    );
                    
                    fs.writeFileSync(fullPath, content);
                }
            }
        }
    }
}

/**
 * Sincroniza scripts e templates do Treis Core para o SDK
 */
function syncScripts() {
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

// Execução
log('Iniciando preparação do SDK para publicação...');
syncScripts();
log('Verificando modelos do SDK...');
fixModels(modulesPath);
log('Preparação concluída com sucesso.');
