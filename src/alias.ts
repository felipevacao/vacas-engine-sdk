// Detecta se está rodando em desenvolvimento (ts-node) ou produção (compiled)
const isDev = process.env.NODE_ENV !== 'production' || __filename.endsWith('.ts');

if (isDev) {
  // Desenvolvimento: usa tsconfig-paths
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('tsconfig-paths/register');
} else {
  // Produção: usa module-alias
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('module-alias/register');
}