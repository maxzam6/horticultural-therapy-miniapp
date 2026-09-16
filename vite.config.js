import { defineConfig, loadEnv } from "vite";
import uni from "@dcloudio/vite-plugin-uni";

export default defineConfig(({ mode }) => {
  const env = { ...loadEnv(mode, process.cwd()), ...process.env };
  if (
    env.VITE_RESET_DEMO_ON_LAUNCH === "true" &&
    env.VITE_DATA_MODE &&
    env.VITE_DATA_MODE !== "mock"
  )
    throw new Error("云端或联调构建禁止自动重置演示数据");
  if (env.VITE_DATA_MODE === "cloud" && !env.VITE_CLOUD_ENV)
    throw new Error("云端构建必须配置 VITE_CLOUD_ENV");
  return {
    plugins: [uni()],
    server: {
      host: "127.0.0.1",
      port: 5173,
      strictPort: true,
      proxy: {
        "/local-api": {
          target: "http://127.0.0.1:8788",
          rewrite: (p) => p.replace("/local-api", ""),
        },
      },
    },
  };
});
