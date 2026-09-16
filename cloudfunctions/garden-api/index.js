const cloud = require("wx-server-sdk");
const tcb = require("@cloudbase/node-sdk");
const { createService, initialState } = require("./domain.cjs");
const { parseImage } = require("./media.cjs");
const { cloudRepository } = require("./repository.cjs");
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const app = tcb.init({ env: process.env.TCB_ENV || process.env.SCF_NAMESPACE });
exports.main = async (event) => {
  try {
    const wx = cloud.getWXContext(),
      auth = app.auth().getUserInfo();
    const principal = wx.OPENID
      ? { kind: "member", id: wx.OPENID }
      : auth.uid
        ? { kind: "admin", id: auth.uid }
        : null;
    if (!principal)
      throw Object.assign(new Error("请先登录"), { code: "AUTH" });
    const db = cloud.database();
    const repository = cloudRepository(db);
    const service = createService({ repository }),
      action = event?.action,
      payload = event?.payload || {};
    let data;
    if (action === "media.upload") {
      await service(
        principal,
        principal.kind === "admin" ? "admin.me" : "identity.get",
      );
      const image = parseImage(payload.base64);
      const uploaded = await cloud.uploadFile({
        cloudPath: image.path,
        fileContent: image.bytes,
      });
      try {
        const saved = await service(
          {
            ...principal,
            verifiedUpload: {
              fileId: uploaded.fileID,
              mime: image.mime,
              size: image.bytes.length,
            },
          },
          "media.register",
          { requestId: payload.requestId, uploadHash: image.hash },
        );
        if (saved.fileId !== uploaded.fileID)
          await cloud.deleteFile({ fileList: [uploaded.fileID] });
        data = { id: saved.id };
      } catch (e) {
        await cloud.deleteFile({ fileList: [uploaded.fileID] });
        throw e;
      }
    } else if (action === "media.read") {
      const asset = await service(principal, action, payload),
        file = await cloud.downloadFile({ fileID: asset.fileId });
      data = {
        url: `data:${asset.mime};base64,${file.fileContent.toString("base64")}`,
      };
    } else if (action === "admin.media.cleanup") {
      const actor = { ...principal, maintenance: true };
      const plan = await service(actor, "admin.media.plan", {
        requestId: payload.requestId + "-plan",
      });
      const deleted = plan.assets.length
        ? await cloud.deleteFile({ fileList: plan.assets.map((x) => x.fileId) })
        : { fileList: [] };
      const success = new Set(
        deleted.fileList.filter((x) => x.status === 0).map((x) => x.fileID),
      );
      data = await service(actor, "admin.media.finalize", {
        requestId: payload.requestId + "-done",
        assetIds: plan.assets
          .filter((x) => success.has(x.fileId))
          .map((x) => x.id),
      });
      data.remaining = plan.assets.length - data.cleaned;
    } else data = await service(principal, action, payload);
    return { ok: true, data };
  } catch (e) {
    return {
      ok: false,
      error: {
        code: e.code || "SERVER",
        message: e.code ? e.message : "服务暂不可用，请稍后重试",
      },
    };
  }
};
exports.initialState = initialState;
