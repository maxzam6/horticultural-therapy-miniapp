<script setup>
import { ref, computed } from "vue";
import { login, logout, call, mutation, upload, mode } from "./api";
const user = ref(null),
  username = ref(""),
  password = ref(""),
  busy = ref(false),
  error = ref(""),
  notice = ref(""),
  tab = ref("posts"),
  items = ref([]),
  cursor = ref(null),
  status = ref(""),
  editor = ref(null),
  reason = ref(""),
  officialText = ref(""),
  images = ref({}),
  sources = ref([]);
const names = {
  courses: "课程资源",
  posts: "社区帖子",
  comments: "评论管理",
  members: "成员管理",
  admins: "管理员",
  audit: "操作记录",
};
const tabs = computed(() =>
  user.value?.role === "super_admin"
    ? Object.keys(names)
    : ["posts", "comments"],
);
const states = {
  pending: "待审核",
  published: "已发布",
  rejected: "未通过",
  hidden: "隐藏",
  unpublished: "已撤回",
  deleted: "已删除",
  active: "已批准",
  posting_disabled: "禁止发布",
  disabled: "已停用",
  draft: "草稿",
  offline: "已下架",
  archived: "已归档",
};
async function run(fn) {
  if (busy.value) return;
  busy.value = true;
  error.value = "";
  notice.value = "";
  try {
    await fn();
  } catch (e) {
    error.value = e.message;
  } finally {
    busy.value = false;
  }
}
async function signIn() {
  await run(async () => {
    user.value = await login(username.value, password.value);
    password.value = "";
    await load();
  });
}
async function signOut() {
  await logout();
  user.value = null;
  items.value = [];
  images.value = {};
  editor.value = null;
}
async function load(more = false) {
  const r = await call("admin.list", {
    collection: tab.value,
    status: status.value || undefined,
    cursor: more ? cursor.value : null,
  });
  items.value = more ? [...items.value, ...r.items] : r.items;
  cursor.value = r.nextCursor;
  await hydrate(r.items);
}
async function hydrate(rows) {
  for (const id of new Set(rows.flatMap((x) => x.assetIds || []))) {
    try {
      images.value[id] = (await call("media.read", { assetId: id })).url;
    } catch {
      delete images.value[id];
    }
  }
}
async function select(key) {
  if (busy.value) return;
  tab.value = key;
  items.value = [];
  cursor.value = null;
  status.value = "";
  editor.value = null;
  await run(() => load());
}
function blankCourse() {
  return {
    type: "course",
    id: null,
    revision: null,
    sortOrder: 0,
    draft: {
      title: "",
      subtitle: "",
      sense: "touch",
      duration: 20,
      description: "",
      cover: "",
      materials: [],
      safetyTips: [],
      mindfulnessPrompt: "",
      steps: [],
    },
    materialsText: "",
    safetyText: "",
  };
}
function editCourse(c) {
  editor.value = c
    ? {
        type: "course",
        ...JSON.parse(JSON.stringify(c)),
        materialsText: c.draft.materials.join("\n"),
        safetyText: c.draft.safetyTips.join("\n"),
      }
    : blankCourse();
}
async function editOfficial(p) {
  await run(async () => {
    editor.value = {
      type: "official",
      id: p?.id,
      revision: p?.revision,
      title: p?.title || "",
      body: p?.body || "",
      assetIds: [...(p?.assetIds || [])],
      featuredPostIds: [...(p?.featuredPostIds || [])],
    };
    let next = null,
      all = [];
    do {
      const r = await call("admin.list", {
        collection: "posts",
        status: "published",
        cursor: next,
      });
      all.push(...r.items);
      next = r.nextCursor;
    } while (next);
    sources.value = all.filter((x) => x.authorType === "member");
  });
}
async function addImage(event, kind) {
  const files = [...event.target.files];
  await run(async () => {
    for (const file of files) {
      const image = await upload(file);
      if (kind === "cover") editor.value.draft.cover = image.id;
      else {
        if (editor.value.assetIds.length >= 3) throw new Error("最多3张图片");
        editor.value.assetIds.push(image.id);
      }
      images.value[image.id] = (
        await call("media.read", { assetId: image.id })
      ).url;
    }
  });
  event.target.value = "";
}
async function saveCourse() {
  await run(async () => {
    const e = editor.value;
    e.draft.materials = e.materialsText
      .split("\n")
      .map((x) => x.trim())
      .filter(Boolean);
    e.draft.safetyTips = e.safetyText
      .split("\n")
      .map((x) => x.trim())
      .filter(Boolean);
    const r = await mutation("admin.course.save", {
      courseId: e.id || undefined,
      expectedRevision: e.revision,
      draft: e.draft,
      sortOrder: e.sortOrder,
    });
    editCourse(r);
    notice.value = "草稿已保存，发布后小程序才会更新";
    await load();
  });
}
async function stepImage(event, step) {
  const file = event.target.files[0];
  if (!file) return;
  await run(async () => {
    const image = await upload(file);
    step.image = image.id;
    images.value[image.id] = (
      await call("media.read", { assetId: image.id })
    ).url;
  });
  event.target.value = "";
}
async function courseAction(c, action) {
  await run(async () => {
    await mutation(
      `admin.course.${action === "offline" || action === "archived" ? "status" : action}`,
      { courseId: c.id, expectedRevision: c.revision, status: action },
    );
    await load();
    editor.value = null;
    notice.value = "课程操作完成";
  });
}
async function saveOfficial(publish) {
  await run(async () => {
    const e = editor.value;
    const r = await mutation("admin.official.save", {
      postId: e.id,
      expectedRevision: e.revision,
      title: e.title,
      body: e.body,
      assetIds: e.assetIds,
      featuredPostIds: e.featuredPostIds,
      publish,
    });
    e.id = r.id;
    e.revision = r.revision;
    notice.value = publish
      ? "已提交审核，请在帖子列表核验后批准"
      : "草稿已保存";
    await load();
  });
}
async function moderate(p, decision) {
  if (!reason.value.trim()) {
    error.value = "请先填写操作理由";
    return;
  }
  if (
    ["delete", "hide"].includes(decision) &&
    !confirm("确认对这条社区内容执行操作？")
  )
    return;
  await run(async () => {
    await mutation("admin.post.moderate", {
      postId: p.id,
      expectedRevision: p.revision,
      decision,
      reason: reason.value,
    });
    await load();
  });
}
async function memberState(m, value) {
  await run(async () => {
    await mutation("admin.member", {
      memberId: m.id,
      status: value,
      expectedRevision: m.revision,
    });
    await load();
  });
}
async function officialComment(p) {
  if (!officialText.value.trim()) return;
  await run(async () => {
    await mutation("admin.comment.create", {
      postId: p.id,
      body: officialText.value,
    });
    officialText.value = "";
    notice.value = "官方评论已提交审核，请到评论管理批准";
  });
}
async function commentState(c, value) {
  if (!reason.value.trim()) {
    error.value = "请填写操作理由";
    return;
  }
  await run(async () => {
    await mutation("admin.comment.moderate", {
      commentId: c.id,
      expectedRevision: c.revision,
      status: value,
      reason: reason.value,
    });
    await load();
  });
}
async function editComment(c) {
  const text = prompt("修改官方评论（修改后重新审核）", c.body);
  if (text === null) return;
  await run(async () => {
    await mutation("admin.comment.moderate", {
      commentId: c.id,
      expectedRevision: c.revision,
      body: text,
      reason: reason.value || "更新官方评论",
    });
    await load();
  });
}
const newUid = ref(""),
  newRole = ref("content_admin");
async function cleanupImages(){await run(async()=>{const result=await mutation('admin.media.cleanup',{});notice.value=`已清理 ${result.cleaned} 张未引用且超过24小时的图片；待重试 ${result.remaining} 张。`})}
async function role(a, enabled = true) {
  await run(async () => {
    await mutation("admin.role", {
      uid: a?.id || newUid.value,
      role: a?.role || newRole.value,
      enabled,
      expectedRevision: a?.revision,
    });
    newUid.value = "";
    await load();
  });
}
</script>
<template>
  <div class="layout">
    <aside>
      <div class="brand">叶间 · 项目管理</div>
      <p>园艺疗法数字体验</p>
      <small>{{ mode }}</small>
      <nav v-if="user">
        <button
          v-for="key in tabs"
          :key="key"
          :disabled="busy"
          :class="{ active: tab === key }"
          @click="select(key)"
        >
          {{ names[key] }}</button
        ><button @click="signOut">退出登录</button>
      </nav>
    </aside>
    <main>
      <header>
        <div>
          <span class="eyebrow">GARDEN / WORKSPACE</span>
          <h1>{{ user ? names[tab] : "欢迎回来" }}</h1>
        </div>
        <span v-if="user" class="pill">{{
          user.role === "super_admin" ? "超级管理员" : "内容管理员"
        }}</span>
      </header>
      <p v-if="error" role="alert" class="error">{{ error }}</p>
      <p v-if="notice" role="status" class="notice">{{ notice }}</p>
      <form v-if="!user" class="panel login" @submit.prevent="signIn">
        <h2>管理员登录</h2>
        <p>仅项目组授权账号可访问管理数据。</p>
        <label
          >账号<input
            v-model="username"
            autocomplete="username"
            required /></label
        ><label
          >密码<input
            v-model="password"
            type="password"
            autocomplete="current-password"
            required /></label
        ><button class="primary" :disabled="busy">
          {{ busy ? "正在登录" : "登录" }}
        </button>
      </form>
      <template v-else
        ><div class="toolbar">
          <button v-if="user.role==='super_admin'" :disabled="busy" @click="cleanupImages">清理未引用图片</button>
          <button :disabled="busy" @click="run(() => load())">刷新列表</button
          ><select v-model="status" @change="run(() => load())">
            <option value="">全部状态</option>
            <option v-for="(label, key) in states" :value="key">
              {{ label }}
            </option></select
          ><button
            v-if="tab === 'courses'"
            :disabled="busy"
            @click="editCourse()"
          >
            ＋ 新建课程</button
          ><button
            v-if="tab === 'posts'"
            :disabled="busy"
            @click="editOfficial()"
          >
            ＋ 官方发帖 / 每周精选
          </button>
        </div>
        <section v-if="editor" class="panel editor">
          <div class="toolbar">
            <h2>{{ editor.type === "course" ? "课程编辑" : "官方图文" }}</h2>
            <button @click="editor = null">关闭编辑器</button>
          </div>
          <template v-if="editor.type === 'course'"
            ><label
              >课程名称<input
                v-model="editor.draft.title"
                maxlength="40" /></label
            ><label>副标题<input v-model="editor.draft.subtitle" /></label>
            <div class="toolbar">
              <label
                >感官<select v-model="editor.draft.sense">
                  <option value="visual">视觉</option>
                  <option value="touch">触觉</option>
                  <option value="smell">嗅觉</option>
                  <option value="taste">味觉</option>
                  <option value="hearing">听觉</option>
                </select></label
              ><label
                >时长（分钟）<input
                  v-model.number="editor.draft.duration"
                  type="number"
                  min="1"
                  max="240" /></label
              ><label
                >排序<input v-model.number="editor.sortOrder" type="number"
              /></label>
            </div>
            <label
              >封面<input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                @change="addImage($event, 'cover')" /></label
            ><img
              v-if="images[editor.draft.cover]"
              class="thumb"
              :src="images[editor.draft.cover]"
            /><label
              >课程介绍<textarea v-model="editor.draft.description" /></label
            ><label
              >材料（每行一项）<textarea
                v-model="editor.materialsText"
              /></label
            ><label
              >安全事项（每行一项）<textarea
                v-model="editor.safetyText"
              /></label
            ><label
              >正念提示<textarea v-model="editor.draft.mindfulnessPrompt" />
            </label>
            <h3>体验步骤</h3>
            <article
              v-for="(step, i) in editor.draft.steps"
              :key="i"
              class="step"
            >
              <label>步骤 {{ i + 1 }} 标题<input v-model="step.title" /></label
              ><textarea
                v-model="step.description"
                placeholder="步骤说明"
              /><input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                @change="stepImage($event, step)"
              /><img
                v-if="images[step.image]"
                class="thumb"
                :src="images[step.image]"
              /><button @click="editor.draft.steps.splice(i, 1)">
                移除此步
              </button>
            </article>
            <button
              @click="
                editor.draft.steps.push({
                  title: '',
                  description: '',
                  image: '',
                })
              "
            >
              ＋ 添加步骤
            </button>
            <div class="toolbar">
              <button class="primary" :disabled="busy" @click="saveCourse">
                保存草稿</button
              ><button
                v-if="editor.id"
                :disabled="busy"
                @click="courseAction(editor, 'publish')"
              >
                发布已保存版本
              </button>
            </div>
            <details>
              <summary>内容预览</summary>
              <h3>{{ editor.draft.title }}</h3>
              <p>{{ editor.draft.description }}</p>
              <ol>
                <li v-for="step in editor.draft.steps">
                  {{ step.title }}：{{ step.description }}
                </li>
              </ol>
            </details></template
          >
          <template v-else
            ><label>标题<input v-model="editor.title" maxlength="40" /></label
            ><label
              >正文<textarea v-model="editor.body" maxlength="1000" /></label
            ><label
              >图片（最多3张）<input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                @change="addImage($event, 'post')"
            /></label>
            <div class="toolbar">
              <div v-for="(id, i) in editor.assetIds" :key="id">
                <img v-if="images[id]" class="thumb" :src="images[id]" /><button
                  @click="editor.assetIds.splice(i, 1)"
                >
                  移除图片
                </button>
              </div>
            </div>
            <fieldset>
              <legend>每周精选 · 引用公开原作（最多10篇）</legend>
              <label v-for="p in sources" :key="p.id" class="check"
                ><input
                  v-model="editor.featuredPostIds"
                  type="checkbox"
                  :value="p.id"
                />{{ p.title }} · {{ p.authorName }}</label
              >
            </fieldset>
            <p>原作撤回后，精选不再显示该引用。官方内容同样需要审核。</p>
            <button :disabled="busy" @click="saveOfficial(false)">
              保存草稿</button
            ><button
              class="primary"
              :disabled="busy"
              @click="saveOfficial(true)"
            >
              保存并提交审核
            </button></template
          >
        </section>
        <label v-if="['posts', 'comments'].includes(tab)" class="reason"
          >处理理由<input
            v-model="reason"
            placeholder="例如：人工核验图文内容符合项目要求" /></label
        ><label v-if="tab === 'posts'"
          >官方评论正文<textarea
            v-model="officialText"
            maxlength="300"
            placeholder="填写后，点击对应帖子的“官方评论”"
          />
        </label>
        <section v-if="tab === 'admins'" class="panel">
          <label>认证平台 UID<input v-model="newUid" /></label
          ><select v-model="newRole">
            <option value="content_admin">内容管理员</option>
            <option value="super_admin">超级管理员</option></select
          ><button :disabled="busy" @click="role(null)">授权账号</button>
        </section>
        <p v-if="!items.length && !busy" class="empty">这里还没有内容。</p>
        <section v-for="item in items" :key="item.id" class="panel item">
          <template v-if="tab === 'courses'"
            ><h2>{{ item.draft.title }}</h2>
            <p>
              {{ states[item.status] }} · {{ item.draft.senseName }} ·
              {{ item.draft.duration }} 分钟 · 版本 {{ item.revision }}
            </p>
            <div class="toolbar">
              <button @click="editCourse(item)">编辑 / 预览</button
              ><button :disabled="busy" @click="courseAction(item, 'publish')">
                发布</button
              ><button :disabled="busy" @click="courseAction(item, 'default')">
                设为默认</button
              ><button :disabled="busy" @click="courseAction(item, 'offline')">
                下架</button
              ><button :disabled="busy" @click="courseAction(item, 'archived')">
                归档
              </button>
            </div></template
          >
          <template v-else-if="tab === 'posts'"
            ><span class="pill"
              >{{ states[item.status] }} ·
              {{ item.authorType === "official" ? "官方" : "成员" }}</span
            >
            <h2>{{ item.title }}</h2>
            <p class="body">{{ item.body }}</p>
            <div class="toolbar">
              <img
                v-for="id in item.assetIds"
                :key="id"
                class="thumb"
                :src="images[id]"
              />
            </div>
            <p>
              {{ item.authorName }} · 点赞 {{ item.likeCount }} · 评论
              {{ item.commentCount }}
            </p>
            <div class="toolbar">
              <button
                v-if="item.status === 'pending'"
                :disabled="busy"
                @click="moderate(item, 'approve')"
              >
                审核通过</button
              ><button
                v-if="item.status === 'pending'"
                :disabled="busy"
                @click="moderate(item, 'reject')"
              >
                拒绝</button
              ><button
                v-if="item.status === 'published'"
                :disabled="busy"
                @click="moderate(item, 'hide')"
              >
                隐藏</button
              ><button
                v-if="item.status === 'hidden'"
                :disabled="busy"
                @click="moderate(item, 'restore')"
              >
                恢复待审</button
              ><button
                v-if="item.status === 'published'"
                :disabled="busy"
                @click="moderate(item, 'pin')"
              >
                {{ item.pinned ? "取消置顶" : "置顶" }}</button
              ><button
                v-if="item.status === 'published'"
                :disabled="busy"
                @click="officialComment(item)"
              >
                官方评论</button
              ><button
                v-if="
                  item.authorType === 'official' && item.status !== 'deleted'
                "
                @click="editOfficial(item)"
              >
                编辑官方帖</button
              ><button
                v-if="item.authorType === 'official' && item.desiredPublished"
                :disabled="busy"
                @click="moderate(item, 'unpublish')"
              >
                撤下</button
              ><button
                v-if="item.status !== 'deleted'"
                :disabled="busy"
                @click="moderate(item, 'delete')"
              >
                删除帖子
              </button>
            </div></template
          >
          <template v-else-if="tab === 'comments'"
            ><h3>
              {{ item.authorType === "official" ? "官方 · " : ""
              }}{{ item.authorName }} · {{ states[item.status] }}
            </h3>
            <p class="body">{{ item.body }}</p>
            <small>帖子编号：{{ item.postId }}</small>
            <div class="toolbar">
              <button
                v-if="item.status === 'pending'"
                :disabled="busy"
                @click="commentState(item, 'published')"
              >
                审核通过</button
              ><button
                v-if="item.status === 'pending'"
                :disabled="busy"
                @click="commentState(item, 'rejected')"
              >
                拒绝</button
              ><button
                v-if="item.status === 'published'"
                :disabled="busy"
                @click="commentState(item, 'hidden')"
              >
                隐藏</button
              ><button
                v-if="item.status === 'hidden'"
                :disabled="busy"
                @click="commentState(item, 'pending')"
              >
                恢复待审</button
              ><button
                v-if="
                  item.authorType === 'official' && item.status !== 'deleted'
                "
                @click="editComment(item)"
              >
                编辑官方评论</button
              ><button
                v-if="item.status !== 'deleted'"
                :disabled="busy"
                @click="commentState(item, 'deleted')"
              >
                删除
              </button>
            </div></template
          >
          <template v-else-if="tab === 'members'"
            ><h3>{{ item.nickname }}</h3>
            <p>{{ states[item.membershipStatus] }} · {{ item.id }}</p>
            <div class="toolbar">
              <button :disabled="busy" @click="memberState(item, 'active')">
                批准 / 恢复</button
              ><button
                :disabled="busy"
                @click="memberState(item, 'posting_disabled')"
              >
                禁止发布</button
              ><button :disabled="busy" @click="memberState(item, 'disabled')">
                停用
              </button>
            </div></template
          >
          <template v-else-if="tab === 'admins'"
            ><h3>{{ item.id }}</h3>
            <p>{{ item.role }} · {{ item.enabled ? "启用" : "停用" }}</p>
            <button :disabled="busy" @click="role(item, !item.enabled)">
              {{ item.enabled ? "停用" : "启用" }}
            </button></template
          >
          <template v-else
            ><h3>{{ item.action }}</h3>
            <p>{{ item.reason }}</p>
            <small
              >{{ item.createdAt }} · {{ item.operatorUid }} ·
              {{ item.targetId }}</small
            ></template
          >
        </section>
        <button v-if="cursor" :disabled="busy" @click="run(() => load(true))">
          加载更多
        </button></template
      >
    </main>
  </div>
</template>
<style>
* {
  box-sizing: border-box;
}
body {
  margin: 0;
  font: 15px/1.6 system-ui;
  color: #35432f;
  background: #f5f3ec;
}
button,
input,
textarea,
select {
  font: inherit;
}
button {
  border: 1px solid #dce2d3;
  background: #fffdf8;
  color: #506a45;
  border-radius: 9px;
  padding: 8px 15px;
  cursor: pointer;
}
button:disabled {
  opacity: 0.45;
  cursor: wait;
}
input,
textarea,
select {
  border: 1px solid #dbe0d4;
  border-radius: 8px;
  padding: 10px;
  background: white;
  color: #35432f;
}
input,
textarea {
  width: 100%;
}
textarea {
  min-height: 110px;
  resize: vertical;
}
.layout {
  display: flex;
  min-height: 100vh;
}
aside {
  width: 235px;
  background: #e4eadb;
  padding: 38px 24px;
  position: fixed;
  inset: 0 auto 0 0;
}
.brand {
  font-size: 21px;
  font-weight: 700;
}
aside p,
small,
.eyebrow {
  color: #7b8973;
}
.eyebrow {
  font-size: 12px;
  letter-spacing: 3px;
}
nav {
  display: grid;
  gap: 12px;
  margin-top: 36px;
}
nav button {
  text-align: left;
  border: 0;
  background: transparent;
}
nav .active {
  background: #fffdf8;
  font-weight: 700;
}
main {
  margin-left: 235px;
  padding: 42px 6%;
  width: calc(100% - 235px);
  max-width: 1500px;
}
header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
}
h1 {
  font-size: 32px;
  margin: 5px 0;
}
h2 {
  font-size: 21px;
}
h3 {
  font-size: 17px;
}
.panel {
  background: #fffdf8;
  border: 1px solid #e7e7db;
  border-radius: 18px;
  padding: 26px;
  margin: 22px 0;
  box-shadow: 0 6px 25px #52613d06;
}
.login {
  max-width: 440px;
  margin: 50px auto;
}
label {
  display: block;
  margin: 16px 0;
}
label input,
label textarea,
label select {
  display: block;
  margin-top: 7px;
}
.primary {
  background: #658256;
  color: white;
  margin-top: 14px;
}
.toolbar {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}
.toolbar label {
  flex: 1;
}
.pill {
  background: #e8eedf;
  padding: 5px 12px;
  border-radius: 50px;
  font-size: 12px;
}
.error {
  background: #f9e5dd;
  color: #934c3a;
  padding: 15px;
  border-radius: 10px;
}
.notice {
  background: #e5efdc;
  padding: 15px;
  border-radius: 10px;
}
.thumb {
  max-width: 180px;
  max-height: 180px;
  border-radius: 12px;
  object-fit: contain;
}
.body {
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
.step {
  background: #f3f4eb;
  padding: 16px;
  border-radius: 10px;
  margin: 14px 0;
}
.check {
  display: flex;
  gap: 10px;
  align-items: center;
}
.check input {
  width: auto;
}
.empty {
  text-align: center;
  padding: 60px;
  color: #899080;
}
fieldset {
  border: 1px solid #dce2d3;
  border-radius: 10px;
}
@media (max-width: 800px) {
  aside {
    position: static;
    width: 100%;
  }
  .layout {
    display: block;
  }
  main {
    margin: 0;
    width: 100%;
    padding: 25px;
  }
  nav {
    display: flex;
    flex-wrap: wrap;
  }
}
</style>
