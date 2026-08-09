<script setup>
import AppPageShell from '@/components/AppPageShell.vue'
import { mockUser } from '@/mock'
</script>

<template>
  <AppPageShell
    :title="mockUser.nickname"
    description="用户信息、成长身份、最近评估、记录入口、关于园艺疗法和隐私说明将在 P13 任务中实现。"
    status="P13 Tab 与用户 Store 已就绪"
  />
</template>
