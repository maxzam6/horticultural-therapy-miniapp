<script setup>
import AppPageShell from '@/components/AppPageShell.vue'
import { ROUTES } from '@/config/routes'
import { goTo } from '@/services/navigation'

const explore = () => goTo(ROUTES.EXPLORE)
</script>

<template>
  <AppPageShell
    title="状态报告"
    description="本页将展示 emotion、stress、nature 和状态体验概览分，不使用医学诊断表述。"
    status="P06 数据契约已冻结"
    button-label="进入探索"
    @primary="explore"
  />
</template>
