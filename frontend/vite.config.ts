// vite.config.js
import { defineConfig, transformWithEsbuild } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    {
      name: "treat-js-files-as-jsx",
      async transform(code, id) {
        if (!id.match(/src\/.*\.js$/)) return null;

        // Use the exposed transform from vite, instead of directly
        // transforming with esbuild
        return transformWithEsbuild(code, id, {
          loader: "jsx",
          jsx: "automatic",
        });
      },
    },
    react(),
  ],

  define: {
    "process.env": {},
  },
  optimizeDeps: {
    force: true,
    esbuildOptions: {
      loader: {
        ".js": "jsx",
      },
    },
  },
  resolve: {
    alias: {
      // Define your aliases here
      "@": path.resolve(__dirname, "./src"),
      // "@/components": path.resolve(__dirname, "./src/components/"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",

        changeOrigin: true,
      },
    },
  },
});
