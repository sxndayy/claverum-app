import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: { 
    port: 8080, 
    strictPort: true 
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Optimize chunk splitting for better mobile performance
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Only split non-critical vendors - let Vite handle React automatically
          if (id.includes('node_modules')) {
            // Don't split React/React-DOM/React-Router - let Vite handle them automatically
            // They need to be in the initial bundle for proper loading order
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return; // Let Vite handle React chunks automatically
            }
            // Split UI libraries (non-critical)
            if (id.includes('lucide-react')) {
              return 'ui-vendor';
            }
            // Other node_modules go into vendor chunk
            return 'vendor';
          }
        },
      },
    },
    // Use esbuild for safer minification (default)
    // Terser removed for stability - esbuild is faster and safer
    // Chunk size warnings
    chunkSizeWarningLimit: 1000,
  },
});
