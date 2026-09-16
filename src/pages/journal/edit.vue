<script setup>
import { ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { useCommunityStore } from "@/stores/community";
import { requestId } from "@/services/community-api";
import CommunityIdentity from "@/components/CommunityIdentity.vue";
const store = useCommunityStore(),
  title = ref(""),
  body = ref(""),
  photos = ref([]),
  sync = ref(false),
  busy = ref(false),
  error = ref(""),
  entry = ref(null);
let saveId = requestId(),
  publishId = requestId(),
  saved = null;
onLoad(async (o) => {
  if (o?.journalId) {
    try {
      entry.value = await store.getJournal(decodeURIComponent(o.journalId));
      title.value = entry.value.title;
      body.value = entry.value.body;
      photos.value = entry.value.assetIds.map((id) => ({
        id,
        url: store.images[id],
      }));
      sync.value = !!entry.value.post?.desiredPublished;
    } catch (e) {
      error.value = e.message;
    }
  }
});
function changed() {
  saveId = requestId();
  publishId = requestId();
  saved = null;
}
async function choose() {
  if (busy.value || photos.value.length >= 3) return;
  try {
    const r = await uni.chooseImage({
      count: 3 - photos.value.length,
      sizeType: ["compressed"],
      sourceType: ["camera", "album"],
    });
    photos.value.push(
      ...r.tempFilePaths.map((url) => ({
        url,
        id: null,
        requestId: requestId(),
      })),
    );
    changed();
  } catch (e) {
    if (!String(e.errMsg).includes("cancel"))
      error.value = "未能选择照片，请重试";
  }
}
async function save() {
  if (busy.value) return;
  if (!title.value.trim() || !body.value.trim() || !photos.value.length) {
    error.value = "请填写标题、正文，并选择至少一张照片";
    return;
  }
  if (sync.value && !saved) {
    const r = await uni.showModal({
      title: "确认同步社区",
      content:
        "将公开本篇图文，作品可能被选入每周精选。取消同步可撤回。保存已同步内容会重新审核。",
    });
    if (!r.confirm) return;
  }
  busy.value = true;
  error.value = "";
  try {
    await store.ensure();
    for (const photo of photos.value)
      if (!photo.id) {
        const r = await store.upload(photo.url, photo.requestId);
        photo.id = r.id;
      }
    if (!saved)
      saved = await store.saveJournal({
        journalId: entry.value?.id,
        title: title.value,
        body: body.value,
        assetIds: photos.value.map((x) => x.id),
        expectedRevision: entry.value?.revision,
        requestId: saveId,
      });
    entry.value = saved;
    if (sync.value || saved.post?.desiredPublished)
      await store.publication(
        "journal",
        saved,
        saved.post,
        sync.value,
        publishId,
      );
    uni.redirectTo({
      url: `/pages/journal/detail?journalId=${encodeURIComponent(saved.id)}`,
    });
  } catch (e) {
    error.value = (saved ? "日记已保存，社区同步未成功：" : "") + e.message;
  } finally {
    busy.value = false;
  }
}
</script>
<template>
  <view class="page-container journal-edit"
    ><text class="heading">留住今天的一点自然</text
    ><text class="hint">默认仅自己可见 · 不计入体验成长次数</text
    ><CommunityIdentity />
    <input
      v-model="title"
      :disabled="busy"
      maxlength="40"
      placeholder="给今天的记录起个名字"
      @input="changed"
    /><textarea
      v-model="body"
      :disabled="busy"
      maxlength="1000"
      placeholder="看到了什么？此刻有什么感受？"
      @input="changed"
    />
    <text class="hint"
      >{{ body.length }} / 1000 字 · 照片 {{ photos.length }} / 3</text
    ><view class="photos"
      ><view v-for="(photo, i) in photos" :key="photo.url"
        ><image :src="photo.url" mode="aspectFill" /><button
          :disabled="busy"
          @click="
            photos.splice(i, 1);
            changed();
          "
        >
          移除
        </button></view
      ></view
    ><button :disabled="busy || photos.length >= 3" @click="choose">
      ＋ 拍照 / 选择照片
    </button>
    <view class="row"
      ><text>同步上传社区</text
      ><switch
        :checked="sync"
        :disabled="busy"
        color="#6f8f5f"
        @change="
          sync = $event.detail.value;
          changed();
        " /></view
    ><text v-if="entry?.post?.desiredPublished" class="hint"
      >编辑后，社区内容需重新审核。</text
    ><text class="error" v-if="error">{{ error }}</text
    ><button class="primary" :disabled="busy" @click="save">
      {{ busy ? "正在保存，请稍候" : saved ? "重试社区同步" : "保存自然日记" }}
    </button></view
  >
</template>
<style scoped>
.journal-edit {
  display: flex;
  flex-direction: column;
  gap: 28rpx;
  padding-bottom: 80rpx;
}
.heading {
  font-size: 42rpx;
  font-weight: bold;
  color: #506a45;
}
.hint {
  font-size: 24rpx;
  color: #7b8577;
}
.journal-edit input,
.journal-edit textarea {
  background: #fffdf8;
  border-radius: 24rpx;
  padding: 24rpx;
  box-sizing: border-box;
  width: 100%;
}
.journal-edit input {
  height: 100rpx;
}
.journal-edit textarea {
  height: 300rpx;
}
.photos {
  display: flex;
  gap: 16rpx;
}
.photos image {
  width: 190rpx;
  height: 190rpx;
  border-radius: 24rpx;
}
.photos button {
  font-size: 24rpx;
}
.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.primary {
  background: #6f8f5f;
  color: white;
  width: 100%;
}
.error {
  color: #9b4e3c;
  font-size: 26rpx;
}
</style>
