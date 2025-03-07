
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => {
  // Get the base URL from environment variables
  // If using a custom domain with GitHub Pages, we should use "/"
  const base = process.env.CUSTOM_DOMAIN === 'true' || process.env.VITE_USE_CUSTOM_DOMAIN === 'true'
    ? '/'
    : process.env.VITE_BASE_URL || '/';
  
  console.log(`Building with base: ${base} in ${mode} mode`);
  console.log(`Custom domain: ${process.env.CUSTOM_DOMAIN || process.env.VITE_USE_CUSTOM_DOMAIN || 'false'}`);
  
  return {
    server: {
      host: "::",
      port: 8080,
    },
    // Use dynamic base path
    base,
    build: {
      // Ensure proper MIME types for assets
      assetsDir: 'assets',
      rollupOptions: {
        output: {
          entryFileNames: 'assets/[name].[hash].js',
          chunkFileNames: 'assets/[name].[hash].js',
          assetFileNames: 'assets/[name].[hash][extname]'
        }
      }
    },
    plugins: [
      react(),
      mode === 'development' &&
      componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
