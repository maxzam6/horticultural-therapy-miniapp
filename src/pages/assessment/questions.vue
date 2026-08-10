<script setup>
import AppProgress from '@/components/AppProgress.vue'
import AppPageShell from '@/components/AppPageShell.vue'
</script>

<template>
  <AppPageShell
    title="状态探索"
    description="10 道 Mock 题和 Pinia 答案容器已经建立，答题交互将在 B021 任务中实现。"
    status="P05 页面骨架待接答题组件"
  >
    <AppProgress :value="0" label="当前进度" />
  </AppPageShell>
</template>
