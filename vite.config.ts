import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  // Prevent Vite from clearing console so we can see Tauri output
  clearScreen: false,
  server: {
    port: 5173,
    strictPort: true,
    watch: {
      // tell vite to ignore watching `src-tauri`
      ignored: ['**/src-tauri/**'],
    },
  },
  build: {
    // Prevent reverse engineering through source maps
    sourcemap: false,
    minify: 'esbuild',
    target: 'esnext',
    cssMinify: true,
    chunkSizeWarningLimit: 1200,
  },
  esbuild: {
    // Drop all console statements and debuggers in production releases
    drop: mode === 'production' ? ['console', 'debugger'] : [],
    legalComments: 'none',
  },
}));
