<script setup>
import AppPageShell from '@/components/AppPageShell.vue'
import AppStateView from '@/components/AppStateView.vue'
import { mockRecords } from '@/mock'
</script>

<template>
  <AppPageShell
    title="我的自然旅程"
    description="历史体验记录和自然印记将在 P12 任务中接入统一 Record 数据。"
    :status="`P12 路由已就绪，当前有 ${mockRecords.length} 条 Mock 记录`"
  >
    <AppStateView
      v-if="!mockRecords.length"
      state="empty"
      title="还没有自然记录"
      description="开始第一次园艺体验，让这一页慢慢长起来。"
    />
  </AppPageShell>
</template>
