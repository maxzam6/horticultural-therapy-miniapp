import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
export default defineConfig(({ mode }) => ({
  root: "admin",
  envDir: "..",
  plugins: [vue()],
  server: {
    fs: { allow: [".."] },
    host: "127.0.0.1",
    port: 5174,
    strictPort: true,
    proxy: {
      "/local-api": {
        target: "http://127.0.0.1:8788",
        rewrite: (p) => p.replace("/local-api", ""),
      },
    },
  },
  build: { outDir: "../dist/admin", emptyOutDir: true },
}));
