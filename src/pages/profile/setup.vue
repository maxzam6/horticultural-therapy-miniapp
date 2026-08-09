<script setup>
import AppPageShell from '@/components/AppPageShell.vue'
import { ROUTES } from '@/config/routes'
import { goTo } from '@/services/navigation'

const continueToAssessment = () => goTo(ROUTES.ASSESSMENT_INTRO)
</script>

<template>
  <AppPageShell
    title="建立自然档案"
    description="昵称、年龄段、园艺经验和体验目标将在 P03 任务中接入统一用户 Store。"
    status="P03 路由与 Store 接口已就绪"
    button-label="查看状态探索介绍"
    @primary="continueToAssessment"
  />
</template>
