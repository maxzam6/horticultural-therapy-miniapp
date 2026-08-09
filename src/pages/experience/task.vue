<script setup>
import AppPageShell from '@/components/AppPageShell.vue'
import { ROUTES } from '@/config/routes'
import { goTo } from '@/services/navigation'

const previewImprint = () => goTo(`${ROUTES.IMPRINT_DETAIL}?recordId=record-demo-001`)
</script>

<template>
  <AppPageShell
    title="体验任务"
    description="步骤状态、心情、感受和唯一 Record 生成逻辑将在 P10 任务中实现。"
    status="P10 Session 路由骨架已就绪"
    button-label="查看印记页面骨架"
    @primary="previewImprint"
  />
</template>
