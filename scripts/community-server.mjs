// Loopback-only integration emulator. Never deploy this development authentication server.
import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { randomUUID, timingSafeEqual } from "node:crypto";
import { createRequire } from "node:module";
import { mockCourses } from "../src/mock/courses.js";
const require = createRequire(import.meta.url);
const {
  createService,
  initialState,
  memoryRepository,
} = require("../cloudfunctions/garden-api/domain.cjs");
const { parseImage } = require("../cloudfunctions/garden-api/media.cjs");
const base = path.resolve(".local-community"),
  statePath = path.join(base, "state.json");
await fs.mkdir(base, { recursive: true });
let seed;
try {
  seed = JSON.parse(await fs.readFile(statePath, "utf8"));
} catch (e) {
  if (e.code !== "ENOENT") throw e;
  seed = initialState(mockCourses, "local-admin");
}
let state = seed,
  queue = Promise.resolve();
const repository = {
  transact(fn) {
    const operation = queue.then(async () => {
      const draft = structuredClone(state),
        result = await fn(draft),
        snapshot = JSON.stringify(draft);
      if (snapshot !== JSON.stringify(state)) {
        const temp = `${statePath}.${randomUUID()}.tmp`;
        await fs.writeFile(temp, snapshot);
        for (let i = 0; ; i++) {
          try {
            await fs.rename(temp, statePath);
            break;
          } catch (e) {
            if (!["EPERM", "EBUSY", "EACCES"].includes(e.code) || i >= 8)
              throw e;
            await new Promise((resolve) => setTimeout(resolve, 50 * (i + 1)));
          }
        }
      }
      state = draft;
      return result;
    });
    queue = operation.catch(() => {});
    return operation;
  },
};
const service = createService({ repository }),
  sessions = new Map(),
  password = process.env.GARDEN_LOCAL_PASSWORD || randomUUID();
const equals = (a, b) => {
  const x = Buffer.from(a || ""),
    y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
};
const headers = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
};
const server = http.createServer(async (req, res) => {
  try {
    if (req.url === "/health") {
      res.writeHead(200, headers);
      res.end(JSON.stringify({ mode: "local-only" }));
      return;
    }
    if (req.method !== "POST") throw new Error("仅支持POST");
    const origin = req.headers.origin;
    if (origin && !/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin))
      throw new Error("来源不允许");
    let raw = "";
    for await (const chunk of req) {
      raw += chunk;
      if (raw.length > 7 * 1024 * 1024) throw new Error("请求过大");
    }
    const body = JSON.parse(raw || "{}");
    let data;
    if (req.url === "/login") {
      if (
        !["admin", "member-a", "member-b"].includes(body.username) ||
        !equals(body.password, password)
      )
        throw new Error("账号或密码不正确");
      const token = randomUUID();
      sessions.set(token, {
        kind: body.username === "admin" ? "admin" : "member",
        id: body.username === "admin" ? "local-admin" : body.username,
        expires: Date.now() + 8 * 3600000,
      });
      data = { token };
    } else {
      const token = req.headers.authorization?.replace("Bearer ", "");
      const principal = sessions.get(token);
      if (!principal || principal.expires < Date.now())
        throw Object.assign(new Error("登录已过期"), { code: "AUTH" });
      const { action, payload = {} } = body;
      if (action === "media.upload") {
        const image = parseImage(payload.base64),
          fileId = randomUUID();
        // Register authorizes BEFORE persisting file; private directory never statically served.
        const saved = await service(
          {
            ...principal,
            verifiedUpload: {
              fileId,
              mime: image.mime,
              size: image.bytes.length,
            },
          },
          "media.register",
          { requestId: payload.requestId, uploadHash: image.hash },
        );
        data = { id: saved.id };
        if (saved.fileId === fileId)
          await fs.writeFile(path.join(base, data.id), image.bytes, {
            flag: "wx",
          });
      } else if (action === "media.read") {
        const asset = await service(principal, action, payload);
        data = {
          url: `data:${asset.mime};base64,${(await fs.readFile(path.join(base, payload.assetId))).toString("base64")}`,
        };
      } else if(action==='admin.media.cleanup') {
        const actor={...principal,maintenance:true},plan=await service(actor,'admin.media.plan',{requestId:payload.requestId+'-plan'}),success=[]
        for(const asset of plan.assets){try{await fs.unlink(path.join(base,asset.id));success.push(asset.id)}catch(e){if(e.code==='ENOENT')success.push(asset.id)}}
        data=await service(actor,'admin.media.finalize',{requestId:payload.requestId+'-done',assetIds:success});data.remaining=plan.assets.length-success.length
      } else data = await service(principal, action, payload);
    }
    res.writeHead(200, headers);
    res.end(JSON.stringify({ ok: true, data }));
  } catch (e) {
    res.writeHead(400, headers);
    res.end(
      JSON.stringify({
        ok: false,
        error: { code: e.code || "INVALID", message: e.message },
      }),
    );
  }
});
server.listen(8788, "127.0.0.1", () => {
  console.log(
    "Local integration service: 127.0.0.1:8788; accounts admin/member-a/member-b",
  );
  console.log(`Temporary LOCAL-only password: ${password}`);
});
