export const communityMode = import.meta.env.VITE_DATA_MODE || "mock";
export const requestId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
let initialized = false;
let localToken = "";
// #ifndef MP-WEIXIN
if (communityMode === "local")
  localToken = sessionStorage.getItem("garden-local-token") || "";
// #endif
export async function localCommunityLogin(username, password) {
  const response = await request("/local-api/login", { username, password });
  localToken = response.token;
  // #ifndef MP-WEIXIN
  sessionStorage.setItem("garden-local-token", localToken);
  // #endif
  return response;
}
function request(url, data) {
  return new Promise((resolve, reject) =>
    uni.request({
      url,
      method: "POST",
      data,
      header: { Authorization: `Bearer ${localToken}` },
      success: (r) =>
        r.data?.ok
          ? resolve(r.data.data)
          : reject(
              Object.assign(
                new Error(r.data?.error?.message || "服务请求失败"),
                { code: r.data?.error?.code },
              ),
            ),
      fail: () => reject(new Error("网络连接失败，请重试")),
    }),
  );
}
export async function communityCall(action, payload = {}) {
  if (communityMode === "local")
    return request("/local-api/rpc", { action, payload });
  if (communityMode !== "cloud")
    throw new Error("社区需要连接云环境，当前体验数据仍保留在本机");
  // #ifdef MP-WEIXIN
  if (!initialized) {
    if (!import.meta.env.VITE_CLOUD_ENV) throw new Error("尚未配置云环境");
    wx.cloud.init({ env: import.meta.env.VITE_CLOUD_ENV, traceUser: true });
    initialized = true;
  }
  const { result } = await wx.cloud.callFunction({
    name: "garden-api",
    data: { action, payload },
  });
  if (!result?.ok)
    throw Object.assign(new Error(result?.error?.message || "云服务暂不可用"), {
      code: result?.error?.code,
    });
  return result.data;
  // #endif
  // #ifndef MP-WEIXIN
  throw new Error("请在微信小程序中连接云服务");
  // #endif
}
export async function readPhoto(path) {
  // #ifdef MP-WEIXIN
  const read = (filePath) =>
    new Promise((resolve, reject) =>
      wx.getFileSystemManager().readFile({
        filePath,
        encoding: "base64",
        success: (r) => resolve(r.data),
        fail: reject,
      }),
    );
  let base64 = await read(path);
  if (base64.length > 7 * 1024 * 1024)
    throw new Error("原照片不能超过5MB，请选择较小照片");
  for (const quality of [70, 45, 25]) {
    if (base64.length <= 900000) return base64;
    const compressed = await uni.compressImage({ src: path, quality });
    base64 = await read(compressed.tempFilePath);
  }
  if (base64.length > 900000)
    throw new Error("照片压缩后仍过大，请选择较小照片");
  return base64;
  // #endif
  // #ifndef MP-WEIXIN
  const blob = await (await fetch(path)).blob();
  const { browserPhoto } = await import("../../shared/browser-photo.js");
  return browserPhoto(blob);
  // #endif
}
export async function resolveImage(assetId) {
  if (!assetId) return "";
  if (assetId.startsWith("/static/")) return assetId;
  const url = (await communityCall("media.read", { assetId })).url;
  // #ifdef MP-WEIXIN
  if (!/^[a-zA-Z0-9-]{1,100}$/.test(assetId)) throw new Error("图片编号无效");
  const match = /^data:image\/(jpeg|png|webp);base64,(.+)$/.exec(url);
  if (!match) throw new Error("图片数据无效");
  const filePath = `${wx.env.USER_DATA_PATH}/garden-media-${assetId}.${match[1] === "jpeg" ? "jpg" : match[1]}`;
  await new Promise((resolve, reject) =>
    wx
      .getFileSystemManager()
      .writeFile({
        filePath,
        data: match[2],
        encoding: "base64",
        success: resolve,
        fail: reject,
      }),
  );
  return filePath;
  // #endif
  // #ifndef MP-WEIXIN
  return url;
  // #endif
}
export function clearImageCache() {
  // #ifdef MP-WEIXIN
  const fs = wx.getFileSystemManager(),
    root = wx.env.USER_DATA_PATH;
  try {
    for (const file of fs.readdirSync(root))
      if (/^garden-media-[a-zA-Z0-9-]{1,100}\.(jpg|png|webp)$/.test(file))
        fs.unlinkSync(`${root}/${file}`);
  } catch {
    /* Cache maintenance must not block startup. */
  }
  // #endif
}
