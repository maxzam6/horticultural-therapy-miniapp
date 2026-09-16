<script setup>
import { computed, ref } from "vue";
import { onShow, onPullDownRefresh, onReachBottom } from "@dcloudio/uni-app";
import { useCommunityStore } from "@/stores/community";
import CommunityIdentity from "@/components/CommunityIdentity.vue";
const store = useCommunityStore(),
  busy = ref(false),
  error = ref("");
const columns = computed(() => [
  store.posts.filter((_, i) => i % 2 === 0),
  store.posts.filter((_, i) => i % 2 === 1),
]);
async function load(more = false) {
  if (busy.value) return;
  busy.value = true;
  error.value = "";
  try {
    await store.loadPosts(more);
  } catch (e) {
    error.value = e.message;
    if (!more) store.posts = [];
  } finally {
    busy.value = false;
    uni.stopPullDownRefresh();
  }
}
onShow(() => load());
onPullDownRefresh(() => load());
onReachBottom(() => {
  if (store.postCursor) load(true);
});
const open = (id) =>
  uni.navigateTo({
    url: `/pages/community/detail?postId=${encodeURIComponent(id)}`,
  });
const write = () => uni.navigateTo({ url: "/pages/journal/edit" });
</script>
<template>
  <view class="page-container community-page"
    ><view class="hero"
      ><text class="eyebrow">一起，与自然靠近</text
      ><text class="title">自然分享空间</text
      ><text class="subtitle">分享一片新叶，也分享今天的心情。</text
      ><button
        :disabled="store.member?.membershipStatus !== 'active'"
        @click="write"
        >＋ 写自然日记</button
      ></view
    ><CommunityIdentity @ready="load()" />
    <view v-if="error" class="notice"
      ><text>{{ error }}</text
      ><button @click="load()">重新加载</button></view
    ><text v-else-if="!busy && !store.posts.length" class="notice"
      >还没有公开作品，期待第一篇自然日记。</text
    >
    <view class="waterfall"
      ><view v-for="(column, index) in columns" :key="index" class="column"
        ><view
          v-for="post in column"
          :key="post.id"
          class="post"
          @click="open(post.id)"
          ><image
            v-if="store.images[post.assetIds?.[0]]"
            :src="store.images[post.assetIds[0]]"
            mode="widthFix"
          /><view v-else class="leaf">一叶一日</view
          ><view class="copy"
            ><text v-if="post.pinned" class="badge">精选置顶</text
            ><text class="post-title">{{ post.title }}</text
            ><text class="author"
              >{{ post.authorType === "official" ? "官方 · " : ""
              }}{{ post.authorName }}</text
            ><text class="counts"
              >♡ {{ post.likeCount }} · 评论 {{ post.commentCount }}</text
            ></view
          ></view
        ></view
      ></view
    ><text v-if="busy" class="notice">正在收集自然的故事…</text
    ><button v-if="store.postCursor && !busy" @click="load(true)">
      加载更多
    </button></view
  >
</template>
<style scoped>
.community-page {
  padding-bottom: 70rpx;
}
.hero {
  background: #e7edde;
  border-radius: 32rpx;
  padding: 36rpx;
  margin-bottom: 28rpx;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.eyebrow {
  font-size: 22rpx;
  color: #718a65;
}
.title {
  font-size: 46rpx;
  color: #385335;
  font-weight: bold;
}
.subtitle {
  font-size: 26rpx;
  color: #77806f;
}
.hero button {
  background: #6f8f5f;
  color: #fffdf8;
  font-size: 26rpx;
  margin: 8rpx 0 0;
}
.waterfall {
  display: flex;
  gap: 20rpx;
  margin-top: 28rpx;
}
.column {
  width: calc(50% - 10rpx);
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}
.post {
  border-radius: 26rpx;
  overflow: hidden;
  background: #fffdf8;
  box-shadow: 0 8rpx 24rpx #41502b0a;
}
.post image {
  width: 100%;
  max-height: 620rpx;
}
.leaf {
  height: 220rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e2ead5;
  color: #6f8f5f;
  font-size: 34rpx;
}
.copy {
  padding: 22rpx;
  display: flex;
  flex-direction: column;
  gap: 14rpx;
}
.post-title {
  font-size: 29rpx;
  font-weight: 600;
  color: #3f5139;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.author,
.counts {
  font-size: 21rpx;
  color: #7a8672;
}
.badge {
  font-size: 20rpx;
  color: #6f8f5f;
}
.notice {
  display: block;
  margin: 28rpx 0;
  font-size: 26rpx;
  color: #7a796e;
}
</style>
