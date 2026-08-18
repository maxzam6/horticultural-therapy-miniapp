<script setup>
import { onShow } from '@dcloudio/uni-app'
import AppPageShell from '@/components/AppPageShell.vue'
import AppStateView from '@/components/AppStateView.vue'
import { useExperienceStore } from '@/stores/experience'

const experienceStore = useExperienceStore()

onShow(() => {
  experienceStore.loadRecords()
})
</script>

<template>
  <AppPageShell
    title="我的自然旅程"
    description="历史体验记录和自然印记将在 P12 任务中接入统一 Record 数据。"
    :status="`P12 路由已就绪，当前有 ${experienceStore.records.length} 条 Mock 记录`"
  >
    <AppStateView
      v-if="!experienceStore.records.length"
      state="empty"
      title="还没有自然记录"
      description="开始第一次园艺体验，让这一页慢慢长起来。"
    />
  </AppPageShell>
</template>
