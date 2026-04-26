import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    // Define test files to include from both packages
    include: [
      'apps/treis/src/**/*.test.ts',
      'packages/verona-sdk/src/**/*.test.ts',
    ],
    // Define aliases for both packages
    alias: {
      '@core': path.resolve(__dirname, './apps/treis/src/core'),
      '@controllers': path.resolve(__dirname, './apps/treis/src/core/controllers'),
      '@adapters': path.resolve(__dirname, './apps/treis/src/core/adapters'),
      '@models': path.resolve(__dirname, './apps/treis/src/core/models'),
      '@utils': path.resolve(__dirname, './apps/treis/src/core/utils'),
      '@transformers': path.resolve(__dirname, './apps/treis/src/core/transformers'),
      '@services': path.resolve(__dirname, './apps/treis/src/core/services'),
      '@middlewares': path.resolve(__dirname, './apps/treis/src/core/middlewares'),
      '@constants': path.resolve(__dirname, './apps/treis/src/core/constants'),
      '@app-types': path.resolve(__dirname, './apps/treis/src/core/types'),
      '@workflows': path.resolve(__dirname, './apps/treis/src/core/workflows'),
      '@interfaces': path.resolve(__dirname, './apps/treis/src/core/interfaces'),
      '@libs': path.resolve(__dirname, './apps/treis/src/core/libs'),
      '@repositories': path.resolve(__dirname, './apps/treis/src/core/repositories'),
      '@core-modules': path.resolve(__dirname, './apps/treis/src/core/modules'),
      '@dynamic-modules': path.resolve(__dirname, './apps/treis/src/dynamic-modules'),
      // Verona SDK aliases
      '@verona-sdk': path.resolve(__dirname, './packages/verona-sdk/src'),
      '@verona-api': path.resolve(__dirname, './packages/verona-sdk/src/api'),
      // Add more Verona specific aliases if needed
    },
  },
});
