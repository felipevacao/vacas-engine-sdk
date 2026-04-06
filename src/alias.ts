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
	require('module-alias/register');
}