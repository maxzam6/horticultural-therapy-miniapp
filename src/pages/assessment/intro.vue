<script setup>
import AppPageShell from '@/components/AppPageShell.vue'
import { ROUTES } from '@/config/routes'
import { goTo } from '@/services/navigation'

const startAssessment = () => goTo(ROUTES.ASSESSMENT_QUESTIONS)
</script>

<template>
  <AppPageShell
    title="了解此刻的自己"
    description="共 10 题，约 1–2 分钟。结果仅用于产品体验反馈，不属于医学诊断或正式量表。"
    status="P04 文案与路由骨架已就绪"
    button-label="开始状态探索"
    @primary="startAssessment"
  />
</template>
