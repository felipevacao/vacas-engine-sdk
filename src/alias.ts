// Detecta se está rodando em desenvolvimento (ts-node) ou produção (compiled)
const isDev = process.env.NODE_ENV !== 'production' || __filename.endsWith('.ts');

// Configuração condicional de aliases: em desenvolvimento usa tsconfig-paths para resolver imports do TypeScript,
// em produção usa module-alias para resolver os mesmos imports no JavaScript compilado,
// garantindo que os caminhos funcionem corretamente em ambos ambientes sem alterar o código fonte.
if (isDev) {
	// Desenvolvimento: usa tsconfig-paths
	// eslint-disable-next-line @typescript-eslint/no-require-imports
	require('tsconfig-paths/register');
} else {
	// Produção: usa module-alias
	// eslint-disable-next-line @typescript-eslint/no-require-imports
	require('module-alias/register');
}