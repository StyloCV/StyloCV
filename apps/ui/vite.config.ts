import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { normalizePath } from "vite";

normalizePath(path.resolve(__dirname, "./foo")); // C:/project/foo
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    viteStaticCopy({
      targets: [
        {
          src: normalizePath(path.resolve(__dirname, "node_modules/pyodide/*")),
          dest: "pyodide",
        },
        {
          src: normalizePath(
            path.resolve(__dirname, "../../pkgs/cv_model/src/cv_model/*"),
          ),
          dest: "cv_model",
        },
      ],
    }),
  ],
  optimizeDeps: {
    exclude: ["pyodide"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
