<script setup>
import { ref } from "vue";
import { useCommunityStore } from "@/stores/community";
const props = defineProps({ record: { type: Object, required: true } }),
  store = useCommunityStore(),
  busy = ref(false),
  message = ref("");
async function share(desired) {
  if (busy.value) return;
  const confirm = await uni.showModal({
    title: desired ? "同步到社区？" : "取消社区同步？",
    content: desired
      ? `将公开“${props.record.courseTitle}”的心情与感受，不包含测评分数或档案信息。公开作品可被项目组选入每周精选，撤回后精选引用失效。`
      : "只撤回社区展示，本人记录和成长统计不会删除。",
  });
  if (!confirm.confirm) return;
  busy.value = true;
  try {
    const r = await store.shareExperience(props.record, desired);
    message.value =
      r.status === "pending"
        ? "已提交，等待审核"
        : r.status === "hidden"
          ? "内容被管理方隐藏"
          : "已取消同步";
  } catch (e) {
    message.value = e.message;
  } finally {
    busy.value = false;
  }
}
</script>
<template>
  <view class="share"
    ><button :disabled="busy" @click="share(true)">同步上传社区</button
    ><button :disabled="busy" @click="share(false)">取消同步</button
    ><text v-if="message">{{ message }}</text></view
  >
</template>
<style scoped>
.share {
  padding: 20rpx;
  background: #f1f3e8;
  border-radius: 24rpx;
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}
.share button {
  font-size: 24rpx;
  color: #506a45;
  background: #fffdf8;
  margin: 0;
}
.share text {
  width: 100%;
  font-size: 24rpx;
}
</style>
