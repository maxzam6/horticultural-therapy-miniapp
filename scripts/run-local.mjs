import { spawn } from "node:child_process";
const target = process.argv[2];
const commands = {
  mini: ["node_modules/@dcloudio/vite-plugin-uni/bin/uni.js"],
  admin: ["node_modules/vite/bin/vite.js", "--config", "admin/vite.config.mjs"],
};
if (!commands[target]) throw new Error("Choose mini or admin");
const child = spawn(process.execPath, commands[target], {
  stdio: "inherit",
  env: { ...process.env, VITE_DATA_MODE: "local" },
});
child.on("exit", (code) => process.exit(code || 0));
