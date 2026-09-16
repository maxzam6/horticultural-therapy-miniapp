<script setup>
import { ref } from "vue";
import { onLoad, onShow } from "@dcloudio/uni-app";
import { useCommunityStore } from "@/stores/community";
const store = useCommunityStore(),
  entry = ref(null),
  error = ref(""),
  busy = ref(false);
let id = "";
const labels = {
  pending: "审核中",
  published: "已发布",
  unpublished: "仅自己可见",
  hidden: "已被隐藏",
  rejected: "审核未通过",
  deleted: "已删除",
};
async function load() {
  if (!id) return;
  error.value = "";
  entry.value = null;
  try {
    entry.value = await store.getJournal(id);
  } catch (e) {
    error.value = e.message;
  }
}
onLoad((o) => {
  try {
    id = decodeURIComponent(o?.journalId || "");
  } catch {}
  if (!id) error.value = "缺少记录信息";
  load();
});
onShow(() => {
  if (id) load();
});
async function publish(desired) {
  if (busy.value) return;
  const r = await uni.showModal({
    title: desired ? "同步上传社区" : "取消同步",
    content: desired
      ? "图文将公开给社区成员，并可被项目组选入每周精选，撤回后精选引用失效。"
      : "仅撤回社区内容，日记仍保留。",
  });
  if (!r.confirm) return;
  busy.value = true;
  try {
    await store.publication("journal", entry.value, entry.value.post, desired);
    await load();
  } catch (e) {
    error.value = e.message;
  } finally {
    busy.value = false;
  }
}
async function remove() {
  if (busy.value) return;
  const r = await uni.showModal({
    title: "删除日记",
    content: "日记及关联社区展示将一并删除，无法恢复。",
  });
  if (!r.confirm) return;
  busy.value = true;
  try {
    await store.deleteJournal(entry.value);
    uni.switchTab({ url: "/pages/records/index" });
  } catch (e) {
    error.value = e.message;
  } finally {
    busy.value = false;
  }
}
function edit() {
  uni.navigateTo({
    url: `/pages/journal/edit?journalId=${encodeURIComponent(id)}`,
  });
}
function openPost() {
  uni.navigateTo({
    url: `/pages/community/detail?postId=${encodeURIComponent(entry.value.post.id)}`,
  });
}
function preview(asset) {
  uni.previewImage({
    current: store.images[asset],
    urls: entry.value.assetIds.map((x) => store.images[x]).filter(Boolean),
  });
}
</script>
<template>
  <view class="page-container journal-detail"
    ><text v-if="error" class="error">{{ error }}</text
    ><button v-if="error" @click="load">重新读取</button
    ><template v-if="entry"
      ><text class="heading">{{ entry.title }}</text
      ><text class="hint"
        >{{ entry.createdAt.slice(0, 10) }} ·
        {{ labels[entry.post?.status] || "仅自己可见" }}</text
      ><text class="body">{{ entry.body }}</text
      ><image
        v-for="asset in entry.assetIds"
        :key="asset"
        :src="store.images[asset]"
        mode="widthFix"
        @click="preview(asset)"
      /><button :disabled="busy" @click="edit">编辑日记</button
      ><button :disabled="busy" @click="publish(true)">同步上传社区</button
      ><button
        v-if="entry.post?.desiredPublished"
        :disabled="busy"
        @click="publish(false)"
      >
        取消同步</button
      ><button v-if="entry.post?.status === 'published'" @click="openPost">
        查看社区帖子</button
      ><button :disabled="busy" @click="remove">删除日记</button></template
    ></view
  >
</template>
<style scoped>
.journal-detail {
  display: flex;
  flex-direction: column;
  gap: 28rpx;
  padding-bottom: 100rpx;
}
.heading {
  font-size: 42rpx;
  color: #506a45;
  font-weight: bold;
}
.hint {
  color: #808879;
  font-size: 24rpx;
}
.body {
  white-space: pre-wrap;
  line-height: 1.8;
}
.journal-detail image {
  width: 100%;
  border-radius: 28rpx;
}
.journal-detail button {
  width: 100%;
  color: #506a45;
  background: #fffdf8;
}
.error {
  color: #9b4e3c;
}
</style>
