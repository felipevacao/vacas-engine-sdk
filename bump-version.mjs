import fs from 'fs';
import { input, confirm } from '@inquirer/prompts';

const packages = [
    { name: 'Root', path: 'package.json' },
    { name: 'Treis', path: 'apps/treis/package.json', env: 'apps/treis/.env' },
    { name: 'Vacas SDK', path: 'packages/vacas-engine-sdk/package.json' },
    { name: 'Verona', path: 'packages/verona/package.json' }
];

async function main() {
    for (const pkg of packages) {
        if (!fs.existsSync(pkg.path)) continue;

        const currentVersion = JSON.parse(fs.readFileSync(pkg.path, 'utf8')).version;
        
        const shouldUpdate = await confirm({ 
            message: `Deseja atualizar a versão do ${pkg.name}? (Atual: ${currentVersion})` 
        });

        if (shouldUpdate) {
            const newVersion = await input({ 
                message: `Para qual versão deseja atualizar o ${pkg.name}?`,
                validate: (val) => /^\d+\.\d+\.\d+$/.test(val) || 'Formato de versão inválido (use x.x.x)'
            });

            // Atualiza package.json
            const content = JSON.parse(fs.readFileSync(pkg.path, 'utf8'));
            content.version = newVersion;
            fs.writeFileSync(pkg.path, JSON.stringify(content, null, 2) + '\n');
            console.log(`✅ ${pkg.name} atualizado para ${newVersion}`);

            // Se o pacote tiver um arquivo .env associado (caso do Treis), atualiza a variável
            if (pkg.env && fs.existsSync(pkg.env)) {
                let envContent = fs.readFileSync(pkg.env, 'utf8');
                // Procura por API_VERSION=... (com ou sem aspas)
                if (envContent.includes('API_VERSION=')) {
                    envContent = envContent.replace(/API_VERSION=['"]?[\d.]+['"]?/, `API_VERSION='${newVersion}'`);
                    fs.writeFileSync(pkg.env, envContent);
                    console.log(`✅ ${pkg.env} atualizado com versão ${newVersion}`);
                } else {
                    console.log(`ℹ️ API_VERSION não encontrado em ${pkg.env}, ignorando.`);
                }
            }
        }
    }

    console.log('🎉 Atualizações concluídas!');
}

main();
