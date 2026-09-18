export const communityMode = import.meta.env.VITE_DATA_MODE || "mock";
export const requestId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
// Keep the full wx.cloud.callFunction request comfortably below the gateway limit.
// Base64 expands binary data and the action/payload JSON adds more bytes.
const MAX_CLOUD_CALL_BASE64_LENGTH = 420 * 1024;
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
  let response;
  try {
    response = await wx.cloud.callFunction({
      name: "garden-api",
      data: { action, payload },
    });
  } catch (error) {
    const detail = String(error?.errMsg || error?.message || "");
    if (/data exceed max size|EXCEED_MAX_PAYLOAD_SIZE/i.test(detail))
      throw Object.assign(
        new Error("照片文件较大，请重新选择或拍摄清晰度较低的照片"),
        { code: "PAYLOAD_TOO_LARGE" },
      );
    if (import.meta.env.DEV)
      console.error("[园艺疗法] 云函数调用失败", {
        action,
        code: error?.errCode || error?.code,
        requestId: error?.requestID || error?.requestId,
        detail,
      });
    throw Object.assign(new Error("云服务暂时没有响应，请稍后重试"), {
      code: error?.errCode || error?.code || "CLOUD_CALL_FAILED",
    });
  }
  const { result } = response;
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
  const info = await uni.getImageInfo({ src: path });
  const attempts = [
    { maxSide: 1440, quality: 82 },
    { maxSide: 1280, quality: 68 },
    { maxSide: 1080, quality: 52 },
    { maxSide: 960, quality: 38 },
    { maxSide: 720, quality: 24 },
  ];
  let base64 = "";
  for (const { maxSide, quality } of attempts) {
    const dimensions =
      info.width >= info.height
        ? { compressedWidth: Math.min(info.width, maxSide) }
        : { compressedHeight: Math.min(info.height, maxSide) };
    const compressed = await uni.compressImage({
      src: path,
      quality,
      ...dimensions,
    });
    base64 = await read(compressed.tempFilePath);
    if (base64.length <= MAX_CLOUD_CALL_BASE64_LENGTH) return base64;
  }
  if (base64.length > MAX_CLOUD_CALL_BASE64_LENGTH)
    throw new Error("照片处理后仍较大，请尝试裁剪后重新上传");
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
