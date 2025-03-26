import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  root: 'frontend', // Set the root directory to the frontend folder
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './frontend/src'), // Map "@" to "frontend/src"
    },
    extensions: ['.js', '.vue', '.json'], // Optional: Simplify imports without file extensions
  },
  server: {
    port: 5173, // Specify the development server port
    allowedHosts: [
      'sustainability.dedyn.io', // Add this host directly
      'localhost', // Include localhost for local development
      '.dedyn.io', // Allow any subdomain under dedyn.io if needed
    ],
  },
  test: {
    globals: true, // Enable global functions like `describe` and `it`
    environment: 'jsdom', // Use jsdom for DOM-related tests
  },
});
