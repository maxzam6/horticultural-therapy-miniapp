<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import AppPageShell from '@/components/AppPageShell.vue'
import { ROUTES } from '@/config/routes'
import { goTo } from '@/services/navigation'

const sessionId = ref('')

onLoad((options) => {
  sessionId.value = options?.sessionId ? decodeURIComponent(options.sessionId) : ''
})

const previewImprint = () => goTo(`${ROUTES.IMPRINT_DETAIL}?recordId=record-demo-001`)
</script>

<template>
  <AppPageShell
    title="体验任务"
    description="步骤状态、心情、感受和唯一 Record 生成逻辑将在 P10 任务中实现。"
    :status="sessionId ? `P10 已接收 Session：${sessionId}` : 'P10 缺少 sessionId'"
    button-label="查看印记页面骨架"
    @primary="previewImprint"
  />
</template>
