import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { randomUUID } from "node:crypto";
const require = createRequire(import.meta.url);
const {
    initialState,
    createService,
  } = require("../cloudfunctions/garden-api/domain.cjs"),
  {
    flatten,
    manifest,
    cloudRepository,
  } = require("../cloudfunctions/garden-api/repository.cjs");
const seed = initialState([], "root");
for (let i = 0; i < 250; i++)
  seed.journals[`journal-${i}`] = {
    id: `journal-${i}`,
    ownerId: "unrelated",
    title: "保存的自然日记",
    body: "叶".repeat(1000),
    assetIds: [],
    revision: 1,
    createdAt: "2026-09-14T00:00:00.000Z",
  };
const initial = flatten(seed);
let storage = new Map(
    Object.entries({ ...initial, manifest: manifest(seed, initial) }),
  ),
  queue = Promise.resolve(),
  maxOperations = 0;
const api = (rows, track = () => {}) => ({
  collection: () => ({
    doc: (id) => ({
      async get() {
        track();
        if (!rows.has(id)) throw new Error("missing");
        return { data: { _id: id, ...structuredClone(rows.get(id)) } };
      },
      async set({ data }) {
        track();
        rows.set(id, structuredClone(data));
      },
      async remove() {
        track();
        rows.delete(id);
      },
    }),
  }),
});
const db = {
  ...api(storage),
  runTransaction(fn) {
    const task = queue.then(async () => {
      const draft = new Map(structuredClone([...storage])),
        count = { value: 0 },
        r = await fn(
          api(draft, () => {
            count.value++;
            assert.ok(
              count.value <= 100,
              "transaction operation ceiling exceeded",
            );
          }),
        );
      maxOperations = Math.max(maxOperations, count.value);
      storage.clear();
      for (const [k, v] of draft) storage.set(k, v);
      return r;
    });
    queue = task.catch(() => {});
    return task;
  },
};
const service = createService({ repository: cloudRepository(db) });
const who = { kind: "member", id: "test" },
  p = { requestId: randomUUID() };
const [one, two] = await Promise.all([
  service(who, "identity.ensure", p),
  service(who, "identity.ensure", p),
]);
assert.equal(one.id, two.id);
await service({ kind: "admin", id: "root" }, "admin.member", {
  memberId: one.id,
  status: "active",
  expectedRevision: 1,
  requestId: randomUUID(),
});
const member = await service(who, "identity.get");
assert.equal(member.membershipStatus, "active");
assert.ok(storage.size > 250);
assert.ok(maxOperations < 20);
assert.equal(
  [...storage.values()].filter((x) => x.table === "users").length,
  1,
);
console.log(
  `Sharded repository passed: ${storage.size} documents; max ${maxOperations} transaction operations; concurrent idempotency and optimistic snapshot retries passed (simulated SDK, not deployed cloud).`,
);
