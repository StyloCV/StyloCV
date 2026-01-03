import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { normalizePath } from "vite";

normalizePath(path.resolve(__dirname, "./foo")); // C:/project/foo
// https://vite.dev/config/
export default defineConfig({
  base: "./",
  plugins: [
    react(),
    tailwindcss(),
    viteStaticCopy({
      targets: [
        {
          src: normalizePath(
            path.resolve(__dirname, "node_modules/pyodide/**"),
          ),
          dest: "pyodide",
        },
        {
          src: normalizePath(
            path.resolve(
              __dirname,
              "node_modules/@myriaddreamin/typst-ts-web-compiler/pkg/**",
            ),
          ),
          dest: "typst-compiler",
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
