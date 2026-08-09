<script setup>
import AppPageShell from '@/components/AppPageShell.vue'
import { ROUTES } from '@/config/routes'
import { goTo } from '@/services/navigation'

const viewRecords = () => goTo(ROUTES.RECORDS)
</script>

<template>
  <AppPageShell
    title="自然印记"
    description="本页将按 recordId 展示刚完成的体验，并由记录页读取同一个 Record。"
    status="P11 动态 recordId 路由已就绪"
    button-label="查看我的记录"
    @primary="viewRecords"
  />
</template>
