import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@core': path.resolve(__dirname, './src/core'),
      '@controllers': path.resolve(__dirname, './src/core/controllers'),
      '@adapters': path.resolve(__dirname, './src/core/adapters'),
      '@models': path.resolve(__dirname, './src/core/models'),
      '@utils': path.resolve(__dirname, './src/core/utils'),
      '@transformers': path.resolve(__dirname, './src/core/transformers'),
      '@services': path.resolve(__dirname, './src/core/services'),
      '@middlewares': path.resolve(__dirname, './src/core/middlewares'),
      '@constants': path.resolve(__dirname, './src/core/constants'),
      '@app-types': path.resolve(__dirname, './src/core/types'),
      '@workflows': path.resolve(__dirname, './src/core/workflows'),
      '@interfaces': path.resolve(__dirname, './src/core/interfaces'),
      '@libs': path.resolve(__dirname, './src/core/libs'),
      '@repositories': path.resolve(__dirname, './src/core/repositories'),
      '@core-modules': path.resolve(__dirname, './src/core/modules'),
      '@dynamic-modules': path.resolve(__dirname, './src/dynamic-modules'),
    },
  },
  test: {
    globals: true,
    environment: 'node',
  },
});