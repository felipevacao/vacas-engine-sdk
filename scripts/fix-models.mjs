import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sdkRoot = path.resolve(__dirname, '../');
const modulesPath = path.join(sdkRoot, 'src/dynamic-modules');

const log = (msg) => console.log(`\x1b[36m[SDK-FIX]\x1b[0m ${msg}`);

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

log('Verificando modelos do SDK...');
fixModels(modulesPath);
log('Concluído.');
