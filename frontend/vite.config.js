import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { nodeResolve } from "@rollup/plugin-node-resolve";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    nodeResolve({
      browser: true,
    }),
    react(),
  ],
});
