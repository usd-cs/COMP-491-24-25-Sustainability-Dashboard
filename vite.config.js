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
    extensions: ['.js', '.vue', '.json'], 
  },
  server: {
    host: '0.0.0.0',
    port: 5173, // Specify the development server port
    allowedHosts: [
      "sustainability.dedyn.io", // Add this host directly
      'localhost', // Include localhost for local development
      '.dedyn.io', // Allow any subdomain under dedyn.io if needed
    ],
  },
  build: {
    outDir: '../dist', // Output directory for production build (relative to the root)
    emptyOutDir: true, // Clear the output directory before building
    sourcemap: false, // Disable sourcemaps for production (optional)
  },
  test: {
    globals: true, // Enable global functions like `describe` and `it`
    environment: 'jsdom', // Use jsdom for DOM-related tests
  },
});
