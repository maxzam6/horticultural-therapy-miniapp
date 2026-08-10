<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import AppPageShell from '@/components/AppPageShell.vue'
import { ROUTES } from '@/config/routes'
import { goTo } from '@/services/navigation'

const recordId = ref('')

onLoad((options) => {
  recordId.value = options?.recordId ? decodeURIComponent(options.recordId) : ''
})

const viewRecords = () => goTo(ROUTES.RECORDS)
</script>

<template>
  <AppPageShell
    title="自然印记"
    description="本页将按 recordId 展示刚完成的体验，并由记录页读取同一个 Record。"
    :status="recordId ? `P11 已接收 Record：${recordId}` : 'P11 缺少 recordId'"
    button-label="查看我的记录"
    @primary="viewRecords"
  />
</template>
