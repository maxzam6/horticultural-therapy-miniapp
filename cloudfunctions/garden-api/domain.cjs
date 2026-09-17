// Pure application service. Identity is supplied ONLY by a trusted runtime, never RPC data.
const { randomUUID, createHash } = require("node:crypto");
const { serialize, deserialize } = require("node:v8");
const copy = (x) => deserialize(serialize(x));
const fail = (code, message) => {
  throw Object.assign(new Error(message), { code });
};
const required = (v, max, label) => {
  if (typeof v !== "string" || !v.trim() || v.trim().length > max)
    fail("INVALID", `${label}不能为空且最多${max}字`);
  return v.trim();
};
const optional = (v, max, label) =>
  v === "" || v == null ? "" : required(v, max, label);
const own = (map, id) =>
  typeof id === "string" && Object.hasOwn(map, id) ? map[id] : null;
const revision = (entity, expected) => {
  if (entity.revision !== expected)
    fail("CONFLICT", "内容已更新，请刷新后重试");
};
const senses = ["visual", "touch", "smell", "taste", "hearing"];
function initialState(courses = [], adminUid = "") {
  const state = {
    users: {},
    admins: {},
    courses: {},
    versions: {},
    journals: {},
    shares: {},
    posts: {},
    comments: {},
    likes: {},
    assets: {},
    requests: {},
    audit: [],
    defaultCourseId: "course-succulent",
  };
  if (adminUid)
    state.admins[adminUid] = {
      id: adminUid,
      role: "super_admin",
      enabled: true,
      revision: 1,
    };
  for (const c of courses)
    state.courses[c.id] = {
      id: c.id,
      draft: copy(c),
      published: { ...copy(c), courseVersionId: randomUUID() },
      status: "published",
      revision: 1,
      sortOrder: 0,
    };
  for (const c of Object.values(state.courses))
    state.versions[c.published.courseVersionId] = copy(c.published);
  return state;
}
function createService({ repository, now = () => new Date().toISOString() }) {
  return async function call(principal, action, p = {}) {
    if (
      !principal ||
      !["member", "admin"].includes(principal.kind) ||
      !principal.id
    )
      fail("AUTH", "请先登录");
    if (!p || typeof p !== "object" || Array.isArray(p))
      fail("INVALID", "请求格式无效");
    return repository.transact(async (s) => {
      if (!s.versions)
        s.versions = Object.fromEntries(
          Object.values(s.courses)
            .filter((c) => c.published)
            .map((c) => [c.published.courseVersionId, copy(c.published)]),
        );
      const stamp = now(),
        uid = principal.id,
        admin = principal.kind === "admin" && own(s.admins, uid);
      const isAdmin = Boolean(admin?.enabled),
        isSuper = isAdmin && admin.role === "super_admin";
      const member = () => {
        const u =
          principal.kind === "member" &&
          Object.values(s.users).find((x) => x.principalId === uid);
        if (!u) fail("MEMBER_REQUIRED", "请先开启云端身份");
        return u;
      };
      const access = (write = false) => {
        const u = member();
        if (!["active", "posting_disabled"].includes(u.membershipStatus))
          fail(
            "MEMBERSHIP",
            u.membershipStatus === "pending"
              ? "成员申请已提交，等待项目组批准"
              : "账号已停用，请联系项目组",
          );
        if (write && u.membershipStatus !== "active")
          fail("RESTRICTED", "暂时不能发布或互动，请联系项目组");
        return u;
      };
      const guardAdmin = (superOnly = false) => {
        if (!isAdmin || (superOnly && !isSuper))
          fail("FORBIDDEN", "没有管理权限");
      };
      const owner = (map, id) => {
        const e = own(map, id);
        if (!e || e.deletedAt || e.ownerId !== access().id)
          fail("NOT_FOUND", "内容不存在或无权访问");
        return e;
      };
      const authorName = (e) =>
        e.authorType === "official"
          ? "园艺疗法项目组"
          : own(s.users, e.ownerId)?.nickname || "自然体验者";
      const source = (post) =>
        post.sourceType === "official"
          ? post
          : own(
              post.sourceType === "journal" ? s.journals : s.shares,
              post.sourceId,
            );
      const visible = (post) =>
        !!post &&
        post.status === "published" &&
        post.desiredPublished &&
        !post.moderationHold &&
        !!source(post) &&
        !source(post).deletedAt &&
        (post.authorType === "official" ||
          ["active", "posting_disabled"].includes(
            own(s.users, post.ownerId)?.membershipStatus,
          ));
      const publicPost = (id) => {
        const post = own(s.posts, id);
        if (!visible(post)) fail("NOT_FOUND", "帖子已撤回或暂不可见");
        return post;
      };
      const postDTO = (post) => ({
        id: post.id,
        title: post.title,
        body: post.body,
        assetIds: post.assetIds,
        authorType: post.authorType,
        authorName: authorName(post),
        createdAt: post.createdAt,
        publishedAt: post.publishedAt,
        pinned: !!post.pinned,
        status: post.status,
        revision: post.revision,
        liked:
          principal.kind === "member" && !!s.likes[`${post.id}:${member().id}`],
        likeCount: Object.values(s.likes).filter((l) => l.postId === post.id)
          .length,
        commentCount: Object.values(s.comments).filter(
          (c) => c.postId === post.id && c.status === "published",
        ).length,
        featured: (post.featuredPostIds || [])
          .map((id) => own(s.posts, id))
          .filter(visible)
          .map((x) => ({
            id: x.id,
            title: x.title,
            authorName: authorName(x),
          })),
      });
      const attachedPost = (type, id) =>
        Object.values(s.posts).find(
          (x) => x.sourceType === type && x.sourceId === id,
        );
      const journalDTO = (e) => ({
        ...e,
        post: (() => {
          const post = attachedPost("journal", e.id);
          return post
            ? {
                id: post.id,
                status: post.status,
                revision: post.revision,
                desiredPublished: post.desiredPublished,
              }
            : null;
        })(),
      });
      const page = (items, cursor) => {
        let offset = 0;
        if (cursor) {
          offset = items.findIndex((x) => x.id === cursor) + 1;
          if (!offset) fail("CURSOR", "列表已更新，请下拉刷新");
        }
        return {
          items: items.slice(offset, offset + 20),
          nextCursor: items.length > offset + 20 ? items[offset + 19].id : null,
        };
      };
      const sort = (items) =>
        items.sort(
          (a, b) =>
            (b.createdAt || "").localeCompare(a.createdAt || "") ||
            b.id.localeCompare(a.id),
        );
      const assets = (ids, min = 0, retained = []) => {
        if (
          !Array.isArray(ids) ||
          ids.length < min ||
          ids.length > 3 ||
          new Set(ids).size !== ids.length
        )
          fail("INVALID", "请选择1至3张图片");
        for (const id of ids) {
          const a = own(s.assets, id);
          if (
            !a ||
            a.status !== "ready" ||
            (!(a.principalId === uid && a.kind === principal.kind) &&
              !(isAdmin && a.kind === "admin" && retained.includes(id)))
          )
            fail("ASSET", "图片未完成上传或不属于当前账号");
        }
        return [...ids];
      };
      const reviewReset = (post) => {
        post.revision++;
        post.status = post.moderationHold
          ? "hidden"
          : post.desiredPublished
            ? "pending"
            : "unpublished";
      };
      const mutate = ![
        "identity.get",
        "courses.list",
        "courses.get",
        "journals.list",
        "journals.get",
        "posts.list",
        "posts.get",
        "posts.forSource",
        "shares.find",
        "comments.list",
        "media.read",
        "admin.me",
        "admin.list",
      ].includes(action);
      let requestKey, payloadHash;
      if (mutate) {
        required(p.requestId, 100, "操作编号");
        requestKey = createHash("sha256")
          .update(`${principal.kind}:${uid}:${action}:${p.requestId}`)
          .digest("hex");
        payloadHash = createHash("sha256")
          .update(JSON.stringify(p))
          .digest("hex");
        // Auth must be rechecked before idempotency replay (disabled users cannot recover prior private data).
        if (action.startsWith("admin.")) guardAdmin();
        else if (action === 'identity.nickname') {
          if(member().membershipStatus === 'disabled') fail('MEMBERSHIP','账号已停用')
        } else if (
          action !== "identity.ensure" &&
          !(action === "media.register" && isAdmin)
        )
          access();
        const old = s.requests[requestKey];
        if (old) {
          if (old.hash !== payloadHash)
            fail("CONFLICT", "重试内容发生变化，请重新操作");
          return copy(old.result);
        }
      }
      let result;
      switch (action) {
        case "identity.ensure": {
          if (principal.kind !== "member") fail("FORBIDDEN", "仅供成员登录");
          let u = Object.values(s.users).find((x) => x.principalId === uid);
          if (!u) {
            u = {
              id: randomUUID(),
              principalId: uid,
              nickname: "自然体验者",
              membershipStatus: "pending",
              revision: 1,
              createdAt: stamp,
            };
            s.users[u.id] = u;
          }
          result = {
            id: u.id,
            nickname: u.nickname,
            membershipStatus: u.membershipStatus,
            revision: u.revision,
          };
          break;
        }
        case "identity.get": {
          const u = member();
          result = {
            id: u.id,
            nickname: u.nickname,
            membershipStatus: u.membershipStatus,
            revision: u.revision,
          };
          break;
        }
        case "identity.nickname": {
          const u = member();
          if(u.membershipStatus==='disabled')fail('MEMBERSHIP','账号已停用')
          revision(u, p.expectedRevision);
          u.nickname = required(p.nickname, 20, "昵称");
          u.revision++;
          result = {
            id: u.id,
            nickname: u.nickname,
            membershipStatus: u.membershipStatus,
            revision: u.revision,
          };
          break;
        }
        case "courses.list":
          result = {
            items: Object.values(s.courses)
              .filter((c) => c.status === "published")
              .sort(
                (a, b) => a.sortOrder - b.sortOrder || a.id.localeCompare(b.id),
              )
              .map((c) => ({
                ...c.published,
                isDefault: c.id === s.defaultCourseId,
              })),
            defaultCourseId: s.defaultCourseId,
          };
          break;
        case "courses.get": {
          const c = own(s.courses, p.courseId);
          if (!c || c.status !== "published") fail("NOT_FOUND", "课程暂未开放");
          result = copy(c.published);
          break;
        }
        case "journals.list":
          result = page(
            sort(
              Object.values(s.journals).filter(
                (j) => j.ownerId === access().id && !j.deletedAt,
              ),
            ).map(journalDTO),
            p.cursor,
          );
          break;
        case "journals.get":
          result = journalDTO(owner(s.journals, p.journalId));
          break;
        case "journals.save": {
          const u = access(),
            existing = p.journalId ? owner(s.journals, p.journalId) : null;
          if (existing) revision(existing, p.expectedRevision);
          const e = {
            id: existing?.id || randomUUID(),
            ownerId: u.id,
            title: required(p.title, 40, "标题"),
            body: required(p.body, 1000, "正文"),
            assetIds: assets(p.assetIds, 1),
            createdAt: existing?.createdAt || stamp,
            updatedAt: stamp,
            revision: (existing?.revision || 0) + 1,
          };
          const post = attachedPost("journal", e.id);
          if (post?.desiredPublished) access(true);
          s.journals[e.id] = e;
          if (post?.desiredPublished && post.status !== "deleted") {
            Object.assign(post, {
              title: e.title,
              body: e.body,
              assetIds: e.assetIds,
            });
            reviewReset(post);
          }
          result = journalDTO(e);
          break;
        }
        case "journals.delete": {
          const j = owner(s.journals, p.journalId);
          revision(j, p.expectedRevision);
          j.deletedAt = stamp;
          j.revision++;
          const post = attachedPost("journal", j.id);
          if (post) {
            post.desiredPublished = false;
            post.status = "deleted";
            post.revision++;
          }
          result = { id: j.id };
          break;
        }
        case 'shares.find': {
          const u=access(),key=required(p.localSourceKey,100,'记录关联编号')
          result=Object.values(s.shares).find(x=>x.ownerId===u.id&&x.localSourceKey===key&&!x.deletedAt)||null
          break
        }
        case "shares.save": {
          const u = access(true),
            key = required(p.localSourceKey, 100, "记录关联编号");
          let e = Object.values(s.shares).find(
            (x) => x.ownerId === u.id && x.localSourceKey === key,
          );
          if (e) {
            result = e;
            break;
          }
          e = {
            id: randomUUID(),
            ownerId: u.id,
            localSourceKey: key,
            title: required(p.courseTitle, 40, "课程名称"),
            body: required(
              [optional(p.mood, 30, "心情"), optional(p.feeling, 1000, "感受")]
                .filter(Boolean)
                .join(" · ") || "记录一次与自然相处的时光",
              1000,
              "体验感受",
            ),
            assetIds: assets(p.assetIds || []),
            createdAt: stamp,
            revision: 1,
          };
          s.shares[e.id] = e;
          result = e;
          break;
        }
        case "posts.forSource": {
          const e = owner(
            p.sourceType === "journal" ? s.journals : s.shares,
            p.sourceId,
          );
          const post = attachedPost(p.sourceType, e.id);
          result = post
            ? {
                id: post.id,
                status: post.status,
                revision: post.revision,
                desiredPublished: post.desiredPublished,
              }
            : null;
          break;
        }
        case "posts.publication": {
          if (
            !["journal", "experience"].includes(p.sourceType) ||
            typeof p.desiredPublished !== "boolean"
          )
            fail("INVALID", "发布参数无效");
          const u = p.desiredPublished ? access(true) : access(),
            e = owner(
              p.sourceType === "journal" ? s.journals : s.shares,
              p.sourceId,
            );
          revision(e, p.sourceRevision);
          let post = attachedPost(p.sourceType, e.id);
          if (post) {
            revision(post, p.expectedPostRevision);
            if (post.status === "deleted")
              fail("DELETED", "该帖子已删除，不能恢复");
          } else {
            if (p.expectedPostRevision !== null)
              fail("CONFLICT", "请刷新发布状态");
            post = {
              id: randomUUID(),
              sourceType: p.sourceType,
              sourceId: e.id,
              ownerId: u.id,
              authorType: "member",
              createdAt: stamp,
              revision: 0,
              moderationHold: false,
            };
            s.posts[post.id] = post;
          }
          Object.assign(post, {
            title: e.title,
            body: e.body,
            assetIds: [...e.assetIds],
            desiredPublished: p.desiredPublished,
          });
          reviewReset(post);
          result = {
            id: post.id,
            status: post.status,
            revision: post.revision,
            desiredPublished: post.desiredPublished,
          };
          break;
        }
        case "posts.list":
          access();
          result = page(
            Object.values(s.posts)
              .filter(visible)
              .sort(
                (a, b) =>
                  Number(!!b.pinned) - Number(!!a.pinned) ||
                  (b.publishedAt || "").localeCompare(a.publishedAt || "") ||
                  b.id.localeCompare(a.id),
              )
              .map(postDTO),
            p.cursor,
          );
          break;
        case "posts.get":
          access();
          result = postDTO(publicPost(p.postId));
          break;
        case "posts.like": {
          const u = access(true),
            post = publicPost(p.postId);
          if (typeof p.liked !== "boolean") fail("INVALID", "点赞参数无效");
          const key = `${post.id}:${u.id}`;
          if (p.liked) s.likes[key] = { postId: post.id, memberId: u.id };
          else delete s.likes[key];
          result = postDTO(post);
          break;
        }
        case "comments.list": {
          const u = access();
          publicPost(p.postId);
          result = page(
            Object.values(s.comments)
              .filter(
                (c) =>
                  c.postId === p.postId &&
                  (c.status === "published" ||
                    (c.ownerId === u.id && c.status === "pending")),
              )
              .sort(
                (a, b) =>
                  a.createdAt.localeCompare(b.createdAt) ||
                  a.id.localeCompare(b.id),
              )
              .map((c) => ({
                id: c.id,
                body: c.body,
                status: c.status,
                authorName: authorName(c),
                authorType: c.authorType,
                mine: c.ownerId === u.id,
                createdAt: c.createdAt,
              })),
            p.cursor,
          );
          break;
        }
        case "comments.create": {
          const u = access(true);
          publicPost(p.postId);
          const recent = Object.values(s.comments).filter(
            (c) =>
              c.ownerId === u.id &&
              Date.parse(stamp) - Date.parse(c.createdAt) < 60000,
          );
          if (recent.length >= 5) fail("RATE_LIMIT", "评论太快了，请稍后再试");
          const c = {
            id: randomUUID(),
            postId: p.postId,
            ownerId: u.id,
            authorType: "member",
            body: required(p.body, 300, "评论"),
            status: "pending",
            revision: 1,
            createdAt: stamp,
          };
          s.comments[c.id] = c;
          result = { id: c.id, status: c.status };
          break;
        }
        case "comments.delete": {
          const c = own(s.comments, p.commentId);
          if (!c || c.ownerId !== access().id)
            fail("FORBIDDEN", "只能删除自己的评论");
          c.status = "deleted";
          c.revision++;
          result = { id: c.id };
          break;
        }
        case "media.register": {
          if (isAdmin) guardAdmin();
          else access();
          if (!principal.verifiedUpload)
            fail("FORBIDDEN", "文件必须经服务端检查");
          const a = {
            id: randomUUID(),
            principalId: uid,
            kind: principal.kind,
            fileId: principal.verifiedUpload.fileId,
            mime: principal.verifiedUpload.mime,
            size: principal.verifiedUpload.size,
            status: "ready",
            createdAt: stamp,
          };
          s.assets[a.id] = a;
          result = { id: a.id, fileId: a.fileId };
          break;
        }
        case "media.read": {
          const a = own(s.assets, p.assetId);
          if (!a || a.status !== 'ready') fail("NOT_FOUND", "图片不存在");
          const mine = a.principalId === uid && a.kind === principal.kind;
          const published = Object.values(s.posts).some(
            (post) => visible(post) && post.assetIds?.includes(a.id),
          );
          const reviewable =
            isAdmin &&
            Object.values(s.posts).some(
              (post) =>
                post.status !== "deleted" &&
                (post.desiredPublished || post.authorType === "official") &&
                post.assetIds?.includes(a.id),
            );
          const referencesImage = (c) =>
            c.cover === a.id ||
            (c.steps || []).some((step) => step.image === a.id);
          const managedCourse =
            isSuper &&
            a.kind === "admin" &&
            Object.values(s.courses).some((c) => referencesImage(c.draft));
          const course =
            a.kind === "admin" &&
            Object.values(s.versions).some(referencesImage);
          if (!isAdmin && !course) access();
          if (!mine && !published && !reviewable && !course && !managedCourse)
            fail("FORBIDDEN", "无权查看此图片");
          result = { fileId: a.fileId, mime: a.mime };
          break; // Runtime replaces fileId with authorized bytes; never expose raw storage ID.
        }
        case "admin.me":
          guardAdmin();
          result = { role: admin.role };
          break;
        case "admin.list": {
          guardAdmin();
          if (["members", "courses", "admins", "audit"].includes(p.collection))
            guardAdmin(true);
          let items;
          switch (p.collection) {
            case "members":
              items = Object.values(s.users).map(({ principalId, ...u }) => u);
              break;
            case "courses":
              items = Object.values(s.courses);
              break;
            case "posts":
              items = Object.values(s.posts).map((x) => ({
                ...postDTO(x),
                ...((!x.desiredPublished || x.status === "deleted") &&
                x.authorType === "member"
                  ? { title: "成员已撤回内容", body: "", assetIds: [] }
                  : {}),
                desiredPublished: x.desiredPublished,
                moderationHold: x.moderationHold,
                featuredPostIds: x.featuredPostIds || [],
              }));
              break;
            case "comments":
              items = Object.values(s.comments).map((x) => ({
                ...x,
                authorName: authorName(x),
              }));
              break;
            case "admins":
              items = Object.values(s.admins);
              break;
            case "audit":
              items = s.audit;
              break;
            default:
              fail("INVALID", "无效列表");
          }
          if (p.status)
            items = items.filter(
              (x) => x.status === p.status || x.membershipStatus === p.status,
            );
          result = page(sort(copy(items)), p.cursor);
          break;
        }
        case "admin.member": {
          guardAdmin(true);
          const u = own(s.users, p.memberId);
          if (!u) fail("NOT_FOUND", "成员不存在");
          revision(u, p.expectedRevision);
          if (!["active", "posting_disabled", "disabled"].includes(p.status))
            fail("INVALID", "成员状态无效");
          if (
            ["active", "posting_disabled"].includes(p.status) &&
            !["active", "posting_disabled"].includes(u.membershipStatus) &&
            Object.values(s.users).filter((x) =>
              ["active", "posting_disabled"].includes(x.membershipStatus),
            ).length >= 30
          )
            fail("CAPACITY", "成员名额最多30人");
          u.membershipStatus = p.status;
          u.revision++;
          result = { id: u.id };
          break;
        }
        case "admin.role": {
          guardAdmin(true);
          const id = required(p.uid, 128, "认证UID");
          if (
            !["super_admin", "content_admin"].includes(p.role) ||
            typeof p.enabled !== "boolean"
          )
            fail("INVALID", "角色无效");
          const old = own(s.admins, id);
          if (old) revision(old, p.expectedRevision);
          if (
            old?.enabled &&
            old.role === "super_admin" &&
            (!p.enabled || p.role !== "super_admin") &&
            Object.values(s.admins).filter(
              (x) => x.enabled && x.role === "super_admin",
            ).length === 1
          )
            fail("LAST_ADMIN", "不能撤销最后一位超级管理员");
          s.admins[id] = {
            id,
            role: p.role,
            enabled: p.enabled,
            revision: (old?.revision || 0) + 1,
          };
          result = s.admins[id];
          break;
        }
        case "admin.course.save": {
          guardAdmin(true);
          const id = p.courseId || `course-${randomUUID()}`,
            c = own(s.courses, id);
          if (c) revision(c, p.expectedRevision);
          const d = p.draft || {};
          if (
            !senses.includes(d.sense) ||
            !Number.isFinite(Number(d.duration)) ||
            Number(d.duration) <= 0 ||
            Number(d.duration) > 240
          )
            fail("INVALID", "请选择感官及1至240分钟时长");
          const lines = (x, label) => {
            if (!Array.isArray(x) || x.length > 30)
              fail("INVALID", `${label}格式无效`);
            return x.map((v) => required(v, 500, label));
          };
          if (!Array.isArray(d.steps) || d.steps.length > 30)
            fail("INVALID", "步骤格式无效");
          const retained = c
            ? [c.draft.cover, ...c.draft.steps.map((x) => x.image)]
            : [];
          const image = (v) => {
            if (!v) return "";
            if (typeof v !== "string") fail("INVALID", "图片无效");
            if (/^\/static\/[a-zA-Z0-9_./-]+$/.test(v) && !v.includes(".."))
              return v;
            assets([v], 0, retained);
            return v;
          };
          const draft = {
            id,
            title: required(d.title, 40, "课程名称"),
            subtitle: optional(d.subtitle, 100, "副标题"),
            sense: d.sense,
            senseName: {
              visual: "视觉",
              touch: "触觉",
              smell: "嗅觉",
              taste: "味觉",
              hearing: "听觉",
            }[d.sense],
            duration: Number(d.duration),
            description: required(d.description, 2000, "课程介绍"),
            cover: image(d.cover),
            materials: lines(d.materials || [], "材料"),
            safetyTips: lines(d.safetyTips || [], "安全提示"),
            mindfulnessPrompt: optional(d.mindfulnessPrompt, 500, "正念提示"),
            steps: d.steps.map((x, i) => ({
              id: x.id || `${id}-${i}`,
              title: required(x.title, 100, "步骤标题"),
              description: required(x.description, 1000, "步骤内容"),
              image: image(x.image),
            })),
          };
          if (!Number.isFinite(Number(p.sortOrder || 0)))
            fail("INVALID", "排序无效");
          s.courses[id] = {
            ...c,
            id,
            draft,
            status: c?.status || "draft",
            sortOrder: Number(p.sortOrder || 0),
            revision: (c?.revision || 0) + 1,
          };
          result = s.courses[id];
          break;
        }
        case "admin.course.publish": {
          guardAdmin(true);
          const c = own(s.courses, p.courseId);
          if (!c) fail("NOT_FOUND", "课程不存在");
          revision(c, p.expectedRevision);
          if (c.id === s.defaultCourseId && !c.draft.steps.length)
            fail("INVALID", "默认课程必须有体验步骤");
          c.published = { ...copy(c.draft), courseVersionId: randomUUID() };
          s.versions[c.published.courseVersionId] = copy(c.published);
          c.status = "published";
          c.revision++;
          result = c;
          break;
        }
        case "admin.course.status": {
          guardAdmin(true);
          const c = own(s.courses, p.courseId);
          if (!c) fail("NOT_FOUND", "课程不存在");
          revision(c, p.expectedRevision);
          if (c.id === s.defaultCourseId)
            fail("DEFAULT_COURSE", "请先指定另一门可体验的默认课程");
          if (!["offline", "archived"].includes(p.status))
            fail("INVALID", "状态无效");
          c.status = p.status;
          c.revision++;
          result = c;
          break;
        }
        case "admin.course.default": {
          guardAdmin(true);
          const c = own(s.courses, p.courseId);
          if (!c || c.status !== "published" || !c.published.steps.length)
            fail("INVALID", "默认课程必须已发布且有步骤");
          s.defaultCourseId = c.id;
          result = { defaultCourseId: c.id };
          break;
        }
        case "admin.official.save": {
          guardAdmin();
          let post = p.postId ? own(s.posts, p.postId) : null;
          if (p.postId && (!post || post.authorType !== "official"))
            fail("FORBIDDEN", "不能改写用户帖子");
          if (post) {
            revision(post, p.expectedRevision);
            if (post.status === "deleted") fail("DELETED", "帖子已删除");
          }
          const featured = Array.isArray(p.featuredPostIds)
            ? [...new Set(p.featuredPostIds)]
            : [];
          if (featured.length > 10) fail("INVALID", "最多精选10件作品");
          featured.forEach(publicPost);
          const fresh = {
            id: post?.id || randomUUID(),
            sourceType: "official",
            sourceId: post?.id || randomUUID(),
            authorType: "official",
            title: required(p.title, 40, "标题"),
            body: required(p.body, 1000, "正文"),
            assetIds: assets(p.assetIds || [], 0, post?.assetIds || []),
            featuredPostIds: featured,
            createdAt: post?.createdAt || stamp,
            revision: post?.revision || 0,
            moderationHold: post?.moderationHold || false,
            desiredPublished: !!p.publish,
          };
          reviewReset(fresh);
          s.posts[fresh.id] = fresh;
          result = {
            id: fresh.id,
            revision: fresh.revision,
            status: fresh.status,
          };
          break;
        }
        case "admin.post.moderate": {
          guardAdmin();
          required(p.reason, 300, "操作理由");
          const post = own(s.posts, p.postId);
          if (!post) fail("NOT_FOUND", "帖子不存在");
          revision(post, p.expectedRevision);
          if (post.status === "deleted") fail("DELETED", "帖子已删除");
          if (p.decision === "approve") {
            if (
              !post.desiredPublished ||
              post.moderationHold ||
              source(post)?.deletedAt
            )
              fail("STATE", "作者已撤回或帖子仍被隐藏");
            post.status = "published";
            post.publishedAt = post.publishedAt || stamp;
          } else if (p.decision === "reject") post.status = "rejected";
          else if (p.decision === "hide") {
            post.moderationHold = true;
            post.status = "hidden";
          } else if (p.decision === "restore") {
            post.moderationHold = false;
            post.status = post.desiredPublished ? "pending" : "unpublished";
          } else if (p.decision === "delete") {
            post.status = "deleted";
            post.desiredPublished = false;
          } else if (
            p.decision === "unpublish" &&
            post.authorType === "official"
          ) {
            post.desiredPublished = false;
            post.status = "unpublished";
          } else if (p.decision === "pin" && visible(post))
            post.pinned = !post.pinned;
          else fail("INVALID", "无效操作");
          post.revision++;
          result = {
            id: post.id,
            status: post.status,
            revision: post.revision,
          };
          break;
        }
        case "admin.comment.create": {
          guardAdmin();
          publicPost(p.postId);
          const c = {
            id: randomUUID(),
            postId: p.postId,
            authorType: "official",
            body: required(p.body, 300, "评论"),
            status: "pending",
            revision: 1,
            createdAt: stamp,
          };
          s.comments[c.id] = c;
          result = c;
          break;
        }
        case "admin.comment.moderate": {
          guardAdmin();
          required(p.reason, 300, "操作理由");
          const c = own(s.comments, p.commentId);
          if (!c) fail("NOT_FOUND", "评论不存在");
          revision(c, p.expectedRevision);
          if (c.status === "deleted") fail("DELETED", "评论已删除");
          if (p.body !== undefined) {
            if (c.authorType !== "official")
              fail("FORBIDDEN", "不能修改成员评论");
            c.body = required(p.body, 300, "评论");
            c.status = "pending";
          } else {
            if (
              ![
                "published",
                "rejected",
                "hidden",
                "deleted",
                "pending",
              ].includes(p.status)
            )
              fail("INVALID", "状态无效");
            if (p.status === "published") publicPost(c.postId);
            c.status = p.status;
          }
          c.revision++;
          result = { id: c.id, status: c.status, revision: c.revision };
          break;
        }
        case 'admin.media.plan': {
          guardAdmin(true)
          if(!principal.maintenance)fail('FORBIDDEN','仅供服务端维护')
          const used=new Set()
          for(const j of Object.values(s.journals))if(!j.deletedAt)j.assetIds.forEach(id=>used.add(id))
          for(const share of Object.values(s.shares))if(!share.deletedAt)share.assetIds.forEach(id=>used.add(id))
          for(const post of Object.values(s.posts))if(post.status!=='deleted'&&(post.desiredPublished||post.authorType==='official'))(post.assetIds||[]).forEach(id=>used.add(id))
          for(const c of [...Object.values(s.versions),...Object.values(s.courses).map(x=>x.draft)]){if(c.cover)used.add(c.cover);for(const step of c.steps||[])if(step.image)used.add(step.image)}
          const expired=Object.values(s.assets).filter(a=>!used.has(a.id)&&a.status!=='deleted'&&(a.status==='deleting'||Date.parse(stamp)-Date.parse(a.createdAt)>86400000)).slice(0,10)
          for(const asset of expired)asset.status='deleting'
          result={assets:expired.map(a=>({id:a.id,fileId:a.fileId}))};break
        }
        case 'admin.media.finalize': {
          guardAdmin(true)
          if(!principal.maintenance||!Array.isArray(p.assetIds)||p.assetIds.length>10)fail('FORBIDDEN','仅供服务端维护')
          for(const id of p.assetIds){const a=own(s.assets,id);if(a?.status==='deleting')a.status='deleted'}
          result={cleaned:p.assetIds.length};break
        }
        default:
          fail("NOT_FOUND", "接口不存在");
      }
      if (mutate) {
        if (action.startsWith("admin."))
          s.audit.unshift({
            id: randomUUID(),
            operatorUid: uid,
            action,
            targetId:
              p.postId ||
              p.commentId ||
              p.memberId ||
              p.courseId ||
              p.uid ||
              result.id ||
              "",
            reason: optional(p.reason, 300, "理由"),
            createdAt: stamp,
          });
        for (const [k] of Object.entries(s.requests)
          .filter(
            ([, v]) => Date.parse(stamp) - Date.parse(v.createdAt) > 86400000,
          )
          .slice(0, 10))
          delete s.requests[k];
        s.requests[requestKey] = {
          hash: payloadHash,
          result: copy(result),
          createdAt: stamp,
        };
      }
      return copy(result);
    });
  };
}
function memoryRepository(seed) {
  let state = copy(seed),
    queue = Promise.resolve();
  return {
    async transact(fn) {
      const task = queue.then(async () => {
        const draft = copy(state),
          result = await fn(draft);
        state = draft;
        return result;
      });
      queue = task.catch(() => {});
      return task;
    },
    snapshot: () => copy(state),
  };
}
module.exports = { createService, initialState, memoryRepository };
