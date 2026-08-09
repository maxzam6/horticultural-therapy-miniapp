<script setup>
import AppPageShell from '@/components/AppPageShell.vue'
import { ROUTES } from '@/config/routes'
import { goTo } from '@/services/navigation'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

function startMockExperience() {
  userStore.startMockSession()
  goTo(ROUTES.PROFILE_SETUP)
}
</script>

<template>
  <AppPageShell
    title="开启你的自然旅程"
    description="当前使用 Mock 身份保存演示数据，真实微信登录将在页面闭环稳定后接入。"
    status="P02 Mock 身份模式"
    button-label="使用演示身份继续"
    @primary="startMockExperience"
  />
</template>
