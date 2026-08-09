<script setup>
import AppPageShell from '@/components/AppPageShell.vue'
import { ROUTES } from '@/config/routes'
import { goTo } from '@/services/navigation'

const openGarden = () => goTo(ROUTES.GARDEN)
</script>

<template>
  <AppPageShell
    title="探索自然体验"
    description="从视觉、触觉、嗅觉、味觉和听觉五种方式，与自然建立连接。"
    status="P07 Tab 与五感入口已就绪"
    button-label="进入五感花园"
    @primary="openGarden"
  />
</template>
