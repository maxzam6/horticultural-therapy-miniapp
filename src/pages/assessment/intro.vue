<script setup>
import AppPageShell from '@/components/AppPageShell.vue'
import { ROUTES } from '@/config/routes'
import { goTo } from '@/services/navigation'
import { useAssessmentStore } from '@/stores/assessment'

const assessmentStore = useAssessmentStore()

const startAssessment = () => {
  assessmentStore.resetAssessment()
  goTo(ROUTES.ASSESSMENT_QUESTIONS)
}
</script>

<template>
  <AppPageShell
    title="了解此刻的自己"
    description="共 10 题，约 1–2 分钟。结果仅用于产品体验反馈，不属于医学诊断或正式量表。"
    status="仅用于产品体验反馈，不属于医学诊断或正式量表"
    button-label="开始状态探索"
    @primary="startAssessment"
  />
</template>
