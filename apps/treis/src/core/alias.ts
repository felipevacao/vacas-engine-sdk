import path from 'path';

// Detecta se está rodando em desenvolvimento (ts-node) ou produção (compiled)
// Se o arquivo atual termina em .ts ou .mts, estamos rodando o código fonte TypeScript (provavelmente via ts-node).
// Caso contrário, estamos rodando o código compilado em JavaScript (.js).
const isTsFile = __filename.endsWith('.ts') || __filename.endsWith('.mts');

// Configuração condicional de aliases: em desenvolvimento (TS) usa tsconfig-paths para resolver imports,
// em produção (JS) usa module-alias para resolver os mesmos imports no JavaScript compilado,
// garantindo que os caminhos funcionem corretamente em ambos ambientes sem alterar o código fonte.
if (isTsFile) {
	// Desenvolvimento: usa tsconfig-paths para mapear aliases para arquivos .ts em /src
	// eslint-disable-next-line @typescript-eslint/no-require-imports
	require('tsconfig-paths/register');
} else {
	// Produção: usa module-alias para mapear aliases para arquivos .js em /dist (conforme configurado no package.json)
	// eslint-disable-next-line @typescript-eslint/no-require-imports
	const moduleAlias = require('module-alias');
	
	// Para garantir que os aliases funcionem em qualquer ambiente (como monorepos),
	// configuramos os caminhos absolutos programaticamente baseados na localização deste arquivo.
	// __dirname em dist/core/alias.js -> apps/treis/dist/core
	const distPath = path.resolve(__dirname, '../../dist'); // apps/treis/dist
	
	moduleAlias.addAliases({
		"@core": path.join(distPath, 'core'),
		"@controllers": path.join(distPath, 'core/controllers'),
		"@adapters": path.join(distPath, 'core/adapters'),
		"@models": path.join(distPath, 'core/models'),
		"@utils": path.join(distPath, 'core/utils'),
		"@entities": path.join(distPath, 'dynamic-modules/entities'),
		"@transformers": path.join(distPath, 'core/transformers'),
		"@libs": path.join(distPath, 'core/libs'),
		"@services": path.join(distPath, 'core/services'),
		"@middlewares": path.join(distPath, 'core/middlewares'),
		"@dynamic-modules": path.join(distPath, 'dynamic-modules'),
		"@constants": path.join(distPath, 'core/constants'),
		"@repositories": path.join(distPath, 'core/repositories'),
		"@core-modules": path.join(distPath, 'core/modules'),
		"@app-types": path.join(distPath, 'core/types'),
		"@workflows": path.join(distPath, 'core/workflows'),
	});
}
