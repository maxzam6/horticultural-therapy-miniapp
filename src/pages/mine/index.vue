<script setup>
import { onShow } from '@dcloudio/uni-app'
import AppPageShell from '@/components/AppPageShell.vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

onShow(() => {
  userStore.loadCurrentUser()
})
</script>

<template>
  <AppPageShell
    :title="userStore.user?.nickname || '自然体验者'"
    description="用户信息、成长身份、最近评估、记录入口、关于园艺疗法和隐私说明将在 P13 任务中实现。"
    status="P13 Tab 与用户 Store 已就绪"
  />
</template>
