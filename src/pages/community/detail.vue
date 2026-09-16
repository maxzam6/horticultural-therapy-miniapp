<script setup>
import { ref } from "vue";
import { onLoad, onShow } from "@dcloudio/uni-app";
import { useCommunityStore } from "@/stores/community";
import { requestId } from "@/services/community-api";
const store = useCommunityStore(),
  post = ref(null),
  comments = ref([]),
  cursor = ref(null),
  body = ref(""),
  error = ref(""),
  busy = ref(false);
let id = "",
  commentRequest = requestId();
async function load() {
  error.value = "";
  post.value = null;
  comments.value = [];
  try {
    post.value = await store.getPost(id);
    await loadComments();
  } catch (e) {
    error.value = e.message;
  }
}
async function loadComments(more = false) {
  const r = await store.comments(id, more ? cursor.value : null);
  comments.value = more
    ? [
        ...comments.value,
        ...r.items.filter((x) => !comments.value.some((y) => y.id === x.id)),
      ]
    : r.items;
  cursor.value = r.nextCursor;
}
onLoad((o) => {
  try {
    id = decodeURIComponent(o?.postId || "");
  } catch {}
  if (id) load();
  else error.value = "帖子信息不完整";
});
onShow(() => {
  if (id) load();
});
async function like() {
  if (busy.value) return;
  busy.value = true;
  try {
    post.value = await store.like(post.value);
  } catch (e) {
    error.value = e.message;
  } finally {
    busy.value = false;
  }
}
async function send() {
  if (busy.value || !body.value.trim()) return;
  busy.value = true;
  try {
    await store.comment(id, body.value, commentRequest);
    body.value = "";
    commentRequest = requestId();
    await loadComments();
  } catch (e) {
    error.value = e.message;
  } finally {
    busy.value = false;
  }
}
async function remove(c) {
  if (busy.value) return;
  const r = await uni.showModal({
    title: "删除评论",
    content: "确认删除自己的这条评论？",
  });
  if (!r.confirm) return;
  busy.value = true;
  try {
    await store.removeComment(c.id);
    await loadComments();
    post.value = await store.getPost(id);
  } catch (e) {
    error.value = e.message;
  } finally {
    busy.value = false;
  }
}
function openFeatured(postId) {
  uni.navigateTo({
    url: `/pages/community/detail?postId=${encodeURIComponent(postId)}`,
  });
}
</script>
<template>
  <view class="page-container post-detail"
    ><text class="error" v-if="error">{{ error }}</text
    ><button v-if="error" @click="load">刷新帖子</button
    ><template v-if="post"
      ><text class="author"
        >{{ post.authorType === "official" ? "官方 · " : ""
        }}{{ post.authorName }}</text
      ><text class="heading">{{ post.title }}</text
      ><image
        v-for="asset in post.assetIds"
        :key="asset"
        :src="store.images[asset]"
        mode="widthFix"
      /><text class="body">{{ post.body }}</text
      ><view
        v-for="item in post.featured"
        :key="item.id"
        class="comment"
        @click="openFeatured(item.id)"
        ><text>本周精选 · {{ item.title }}</text
        ><text class="author">{{ item.authorName }} · 查看原作 →</text></view
      ><button :disabled="busy" @click="like">
        {{ post.liked ? "♥ 已点赞" : "♡ 点赞" }} {{ post.likeCount }}</button
      ><text>评论 {{ post.commentCount }}</text
      ><view v-for="c in comments" :key="c.id" class="comment"
        ><text class="author"
          >{{ c.authorType === "official" ? "官方 · " : "" }}{{ c.authorName }}
          {{ c.status === "pending" ? "· 审核中" : "" }}</text
        ><text class="body">{{ c.body }}</text
        ><button v-if="c.mine" :disabled="busy" @click="remove(c)">
          删除
        </button></view
      ><button v-if="cursor" @click="loadComments(true)">更多评论</button
      ><textarea
        v-model="body"
        :disabled="busy"
        maxlength="300"
        placeholder="写一句温暖的回应（审核后公开）"
        @input="commentRequest = requestId()"
      /><button :disabled="busy || !body.trim()" @click="send">
        发送评论
      </button></template
    ></view
  >
</template>
<style scoped>
.post-detail {
  display: flex;
  flex-direction: column;
  gap: 26rpx;
  padding-bottom: calc(100rpx + env(safe-area-inset-bottom));
}
.heading {
  font-size: 42rpx;
  font-weight: bold;
  color: #405537;
}
.author {
  font-size: 24rpx;
  color: #77866e;
}
.body {
  white-space: pre-wrap;
  line-height: 1.8;
  word-break: break-word;
}
.post-detail image {
  width: 100%;
  border-radius: 28rpx;
}
.comment {
  display: flex;
  flex-direction: column;
  gap: 14rpx;
  background: #fffdf8;
  padding: 26rpx;
  border-radius: 24rpx;
}
.comment button {
  font-size: 22rpx;
  margin: 0 0 0 auto;
}
.post-detail textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 24rpx;
  background: #fffdf8;
  border-radius: 24rpx;
  height: 220rpx;
}
.post-detail > button {
  width: 100%;
  color: #506a45;
  background: #e6ecdc;
}
.error {
  color: #9b4e3c;
}
</style>
