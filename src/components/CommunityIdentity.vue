<script setup>
import { ref } from "vue";
import { useCommunityStore } from "@/stores/community";
const store = useCommunityStore(),
  username = ref("member-a"),
  password = ref(""),
  error = ref(""),
  busy = ref(false);
const emit = defineEmits(["ready"]);
async function connect() {
  if (busy.value) return;
  busy.value = true;
  error.value = "";
  try {
    if (store.mode === "local")
      await store.loginLocal(username.value, password.value);
    else await store.ensure();
    emit("ready");
  } catch (e) {
    error.value = e.message;
  } finally {
    busy.value = false;
  }
}
</script>
<template>
  <view class="identity"
    ><template v-if="store.mode === 'local'"
      ><text>本机联调账号</text
      ><input v-model="username" placeholder="成员账号" /><input
        v-model="password"
        password
        placeholder="本地服务启动时显示的密码" /></template
    ><button
      v-if="!store.member || store.member.membershipStatus !== 'active'"
      :disabled="busy"
      @click="connect"
    >
      {{ busy ? "正在连接" : "连接社区 / 刷新成员状态" }}</button
    ><text v-if="store.member?.membershipStatus === 'pending'"
      >申请已提交，请等待项目组批准。</text
    ><text v-if="error">{{ error }}</text></view
  >
</template>
<style scoped>
.identity {
  font-size: 26rpx;
  color: #667460;
}
.identity input {
  height: 88rpx;
  background: #fffdf8;
  padding: 20rpx;
  margin: 10rpx 0;
}
.identity button {
  font-size: 26rpx;
  background: #e9efde;
  color: #506a45;
}
</style>
