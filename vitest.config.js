import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom', // For frontend tests
    include: [
      'frontend/src/tests/**/*.test.js', // Frontend test files
      'backend/__tests__/**/*.test.js',  // Backend test files
    ],
    exclude: ['node_modules', 'dist'],
  },
});