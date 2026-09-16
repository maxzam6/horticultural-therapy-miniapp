import cloudbase from "@cloudbase/js-sdk";
import { browserPhoto } from "../shared/browser-photo.js";
let token = "",
  app = null;
const local = import.meta.env.VITE_DATA_MODE === "local";
function client() {
  if (!app) {
    const env = import.meta.env.VITE_CLOUD_ENV;
    if (!env) throw new Error("未配置云环境，请先按部署说明配置");
    app = cloudbase.init({ env });
  }
  return app;
}
export const mode = local ? "本地联调" : "微信云开发";
export async function login(username, password) {
  if (local) {
    const r = await fetch("/local-api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const result = await r.json();
    if (!result.ok) throw new Error(result.error.message);
    token = result.data.token;
  } else
    await client()
      .auth({ persistence: "session" })
      .signInWithUsernameAndPassword(username, password);
  return call("admin.me");
}
export async function logout() {
  token = "";
  if (app) await app.auth().signOut();
}
export async function call(action, payload = {}) {
  let result;
  if (local) {
    result = await (
      await fetch("/local-api/rpc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action, payload }),
      })
    ).json();
  } else
    result = (
      await client().callFunction({
        name: "garden-api",
        data: { action, payload },
      })
    ).result;
  if (!result?.ok) throw new Error(result?.error?.message || "请求失败");
  return result.data;
}
export const mutation = (action, payload) =>
  call(action, { ...payload, requestId: crypto.randomUUID() });
export async function upload(file) {
  if (file.size > 5 * 1024 * 1024) throw new Error("图片不能超过5MB");
  const base64 = await browserPhoto(file);
  return mutation("media.upload", { base64 });
}
