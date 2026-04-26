import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@verona/sdk': path.resolve(__dirname, '../../packages/verona-sdk/src'),
      '@verona/verona-ui-vue': path.resolve(__dirname, '../../packages/verona-ui-vue/src'),
      // Add other aliases for mock-consumer if needed
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5174, // Choose a different port to avoid conflicts
  }
});
