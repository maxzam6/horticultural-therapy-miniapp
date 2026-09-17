import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { randomUUID } from "node:crypto";
import { mockCourses } from "../src/mock/courses.js";
const require = createRequire(import.meta.url);
const {
  createService,
  initialState,
  memoryRepository,
} = require("../cloudfunctions/garden-api/domain.cjs");
const { parseImage } = require("../cloudfunctions/garden-api/media.cjs");
const repository = memoryRepository(initialState(mockCourses, "admin")),
  service = createService({ repository });
const admin = { kind: "admin", id: "admin" },
  a = { kind: "member", id: "a" },
  b = { kind: "member", id: "b" };
const rpc = (who, action, p = {}) =>
  service(who, action, { ...p, requestId: p.requestId || randomUUID() });
const denied = async (p, code) => assert.rejects(p, (e) => e.code === code);
const ua = await rpc(a, "identity.ensure"),
  ub = await rpc(b, "identity.ensure");
await denied(rpc(a, "posts.list"), "MEMBERSHIP");
await denied(rpc(a, "admin.me", { uid: admin.id, role: "super_admin" }), "FORBIDDEN");
assert.deepEqual(await rpc(admin, "admin.me"), { role: "super_admin" });
await rpc(admin, "admin.member", {
  memberId: ua.id,
  status: "active",
  expectedRevision: 1,
});
await rpc(admin, "admin.member", {
  memberId: ub.id,
  status: "active",
  expectedRevision: 1,
});
await denied(rpc(a, "media.register"), "FORBIDDEN");
const photo = await rpc(
  {
    ...a,
    verifiedUpload: { fileId: "test-file", mime: "image/png", size: 32 },
  },
  "media.register",
);
const input = {
  title: "我的第一株多肉",
  body: "今天叶子长大了一点。",
  assetIds: [photo.id],
  requestId: randomUUID(),
};
const [j, j2] = await Promise.all([
  rpc(a, "journals.save", input),
  rpc(a, "journals.save", input),
]);
assert.equal(j.id, j2.id);
assert.equal(Object.keys(repository.snapshot().journals).length, 1);
await denied(rpc(b, "journals.get", { journalId: j.id }), "NOT_FOUND");
await denied(
  rpc(admin, "journals.get", { journalId: j.id }),
  "MEMBER_REQUIRED",
);
await denied(rpc(b, "media.read", { assetId: photo.id }), "FORBIDDEN");
const textInjection = await rpc(admin, "admin.course.save", {
  draft: {
    ...mockCourses[1],
    title: "权限测试课程",
    description: `不能把这个文字当图片引用 ${photo.id}`,
  },
});
await rpc(admin, "admin.course.publish", {
  courseId: textInjection.id,
  expectedRevision: textInjection.revision,
});
await denied(rpc(b, "media.read", { assetId: photo.id }), "FORBIDDEN");
const pub = {
  sourceType: "journal",
  sourceId: j.id,
  sourceRevision: j.revision,
  expectedPostRevision: null,
  desiredPublished: true,
  requestId: randomUUID(),
};
let post = await rpc(a, "posts.publication", pub);
assert.equal((await rpc(a, "posts.publication", pub)).id, post.id);
assert.equal((await rpc(b, "posts.list")).items.length, 0);
post = await rpc(admin, "admin.post.moderate", {
  postId: post.id,
  expectedRevision: post.revision,
  decision: "approve",
  reason: "人工核验",
});
assert.equal((await rpc(b, "posts.list")).items.length, 1);
assert.equal(
  (await rpc(b, "media.read", { assetId: photo.id })).fileId,
  "test-file",
);
await Promise.all(
  Array.from({ length: 10 }, () =>
    rpc(b, "posts.like", { postId: post.id, liked: true }),
  ),
);
assert.equal((await rpc(b, "posts.get", { postId: post.id })).likeCount, 1);
await rpc(b, "posts.like", { postId: post.id, liked: false });
assert.equal((await rpc(a, "posts.get", { postId: post.id })).likeCount, 0);
const c = await rpc(b, "comments.create", {
  postId: post.id,
  body: "长得真好！",
});
assert.equal(
  (await rpc(a, "comments.list", { postId: post.id })).items.length,
  0,
);
await rpc(admin, "admin.comment.moderate", {
  commentId: c.id,
  expectedRevision: 1,
  status: "published",
  reason: "人工核验",
});
assert.equal((await rpc(a, "posts.get", { postId: post.id })).commentCount, 1);
await denied(rpc(a, "comments.delete", { commentId: c.id }), "FORBIDDEN");
await rpc(b, "comments.delete", { commentId: c.id });
assert.equal((await rpc(a, "posts.get", { postId: post.id })).commentCount, 0);
const official = await rpc(admin, "admin.official.save", {
  title: "本周精选",
  body: "谢谢大家认真照顾植物。",
  assetIds: [],
  featuredPostIds: [post.id],
  publish: true,
});
await rpc(admin, "admin.post.moderate", {
  postId: official.id,
  expectedRevision: official.revision,
  decision: "approve",
  reason: "核验官方内容",
});
assert.equal(
  (await rpc(a, "posts.get", { postId: official.id })).featured.length,
  1,
);
const oc = await rpc(admin, "admin.comment.create", {
  postId: post.id,
  body: "项目组：谢谢你的分享。",
});
await rpc(admin, "admin.comment.moderate", {
  commentId: oc.id,
  expectedRevision: 1,
  status: "published",
  reason: "核验官方回复",
});
assert.equal(
  (await rpc(a, "comments.list", { postId: post.id })).items[0].authorType,
  "official",
);
post = await rpc(a, "posts.publication", {
  ...pub,
  requestId: randomUUID(),
  expectedPostRevision: post.revision,
  desiredPublished: false,
});
await denied(rpc(b, "posts.get", { postId: post.id }), "NOT_FOUND");
await denied(rpc(b, "media.read", { assetId: photo.id }), "FORBIDDEN");
assert.equal(
  (await rpc(a, "posts.get", { postId: official.id })).featured.length,
  0,
);
await denied(
  rpc(admin, "admin.post.moderate", {
    postId: post.id,
    expectedRevision: post.revision,
    decision: "approve",
    reason: "迟到审核",
  }),
  "STATE",
);
const privateEdit = await rpc(a, "journals.save", {
  journalId: j.id,
  expectedRevision: j.revision,
  title: "私密更新",
  body: "撤回后的私密文字",
  assetIds: [photo.id],
});
const adminRows = await rpc(admin, "admin.list", { collection: "posts" });
assert.ok(!JSON.stringify(adminRows).includes("撤回后的私密文字"));
pub.sourceRevision = privateEdit.revision;
post = await rpc(a, "posts.publication", {
  ...pub,
  requestId: randomUUID(),
  expectedPostRevision: post.revision,
});
post = await rpc(admin, "admin.post.moderate", {
  postId: post.id,
  expectedRevision: post.revision,
  decision: "hide",
  reason: "隐藏测试",
});
post = await rpc(a, "posts.publication", {
  ...pub,
  requestId: randomUUID(),
  expectedPostRevision: post.revision,
});
assert.equal(post.status, "hidden");
post = await rpc(admin, "admin.post.moderate", {
  postId: post.id,
  expectedRevision: post.revision,
  decision: "delete",
  reason: "删除终态测试",
});
const afterDelete = await rpc(a, "journals.save", {
  journalId: j.id,
  expectedRevision: privateEdit.revision,
  title: "删除后编辑",
  body: "继续记录私密生活",
  assetIds: [photo.id],
});
await denied(
  rpc(a, "posts.publication", {
    ...pub,
    sourceRevision: afterDelete.revision,
    expectedPostRevision: post.revision,
    requestId: randomUUID(),
  }),
  "DELETED",
);
const list = await rpc(admin, "admin.list", { collection: "courses" }),
  course = list.items.find((x) => x.id === "course-succulent"),
  oldVersion = course.published.courseVersionId;
const changed = await rpc(admin, "admin.course.save", {
  courseId: course.id,
  expectedRevision: course.revision,
  draft: { ...course.draft, title: "新版多肉课程" },
});
assert.equal(
  (await rpc(a, "courses.get", { courseId: course.id })).courseVersionId,
  oldVersion,
);
await rpc(admin, "admin.course.publish", {
  courseId: course.id,
  expectedRevision: changed.revision,
});
assert.notEqual(
  (await rpc(a, "courses.get", { courseId: course.id })).courseVersionId,
  oldVersion,
);
await denied(
  rpc(admin, "admin.course.status", {
    courseId: course.id,
    expectedRevision: changed.revision + 1,
    status: "offline",
  }),
  "DEFAULT_COURSE",
);
await denied(
  rpc(admin, "admin.role", {
    uid: "admin",
    role: "content_admin",
    enabled: true,
    expectedRevision: 1,
  }),
  "LAST_ADMIN",
);
for (let i = 0; i < 28; i++) {
  const u = await rpc({ kind: "member", id: `member-${i}` }, "identity.ensure");
  await rpc(admin, "admin.member", {
    memberId: u.id,
    status: "active",
    expectedRevision: 1,
  });
}
const extra = await rpc({ kind: "member", id: "member-31" }, "identity.ensure");
await denied(
  rpc(admin, "admin.member", {
    memberId: extra.id,
    status: "active",
    expectedRevision: 1,
  }),
  "CAPACITY",
);
await denied(
  rpc(a, "journals.save", { ...input, body: "different" }),
  "CONFLICT",
);
assert.throws(() =>
  parseImage(Buffer.from('<svg onload="bad()"/>').toString("base64")),
);
console.log(
  "Community workflow passed: identity → private photo diary → review → two-member feed → likes/comments → official selection/reply → withdrawal; privacy, idempotency, capacity, course version and admin guards passed.",
);
