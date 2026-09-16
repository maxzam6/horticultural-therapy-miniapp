const { createHash } = require("node:crypto");
const maps = [
  "users",
  "admins",
  "courses",
  "versions",
  "journals",
  "shares",
  "posts",
  "comments",
  "likes",
  "assets",
  "requests",
];
const docId = (table, id) =>
  createHash("sha256").update(`${table}:${id}`).digest("hex");
function flatten(state) {
  const docs = {};
  for (const table of maps)
    for (const [key, value] of Object.entries(state[table]))
      docs[docId(table, key)] = { table, key, value };
  for (const value of state.audit)
    docs[docId("audit", value.id)] = { table: "audit", key: value.id, value };
  return docs;
}
function manifest(state, docs) {
  return {
    schema: 2,
    revision: 0,
    defaultCourseId: state.defaultCourseId,
    ids: Object.keys(docs),
  };
}
function cloudRepository(db) {
  return {
    async transact(fn) {
      for (let attempt = 0; attempt < 8; attempt++) {
        const collection = db.collection("garden_state"),
          meta = (await collection.doc("manifest").get()).data;
        if (meta.schema !== 2) throw new Error("请先初始化数据库结构");
        const state = Object.fromEntries(maps.map((k) => [k, {}]));
        state.audit = [];
        state.defaultCourseId = meta.defaultCourseId;
        const before = {};
        // Bulk snapshot reads are OUTSIDE the bounded write transaction. The manifest revision
        // acts as a global compare-and-swap; any concurrent write forces a fresh snapshot retry.
        for (let start = 0; start < meta.ids.length; start += 20) {
          const ids = meta.ids.slice(start, start + 20);
          const rows = await Promise.all(
            ids.map((id) =>
              collection
                .doc(id)
                .get()
                .catch(() => null),
            ),
          );
          for (let i = 0; i < rows.length; i++) {
            if (!rows[i]) continue;
            const { table, key, value } = rows[i].data;
            before[ids[i]] = { table, key, value: structuredClone(value) };
            if (table === "audit") state.audit.push(value);
            else state[table][key] = value;
          }
        }
        const check = (await collection.doc("manifest").get()).data;
        if (check.revision !== meta.revision) continue;
        if (Object.keys(before).length !== meta.ids.length)
          throw new Error("数据库记录缺失，请联系管理员恢复备份");
        const result = await fn(state),
          after = flatten(state);
        const changed = Object.entries(after).filter(
            ([id, data]) => JSON.stringify(before[id]) !== JSON.stringify(data),
          ),
          removed = Object.keys(before).filter((id) => !after[id]);
        if (
          !changed.length &&
          !removed.length &&
          state.defaultCourseId === meta.defaultCourseId
        )
          return result;
        if (changed.length + removed.length > 80)
          throw new Error("本次变更过多，请拆分操作");
        try {
          await db.runTransaction(async (tx) => {
            const target = tx.collection("garden_state"),
              current = (await target.doc("manifest").get()).data;
            if (current.revision !== meta.revision)
              throw Object.assign(new Error("retry snapshot"), {
                code: "SNAPSHOT_CONFLICT",
              });
            for (const [id, data] of changed)
              await target.doc(id).set({ data });
            for (const id of removed) await target.doc(id).remove();
            await target
              .doc("manifest")
              .set({
                data: {
                  ...manifest(state, after),
                  revision: meta.revision + 1,
                },
              });
          });
          return result;
        } catch (e) {
          if (e.code !== "SNAPSHOT_CONFLICT") throw e;
        }
      }
      throw Object.assign(new Error("同时操作较多，请稍后重试"), {
        code: "BUSY",
      });
    },
  };
}
module.exports = { cloudRepository, flatten, manifest };
