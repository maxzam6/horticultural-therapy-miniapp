<script setup>
import { computed, ref } from 'vue'
import AppPageShell from '@/components/AppPageShell.vue'
import { ROUTES } from '@/config/routes'
import { goTo } from '@/services/navigation'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const loginError = ref('')
const isSubmitting = ref(false)
const status = computed(() => loginError.value || 'P02 Mock 身份模式')

async function startMockExperience() {
  if (isSubmitting.value) return
  isSubmitting.value = true
  loginError.value = ''
  try {
    await userStore.startMockSession()
    goTo(ROUTES.PROFILE_SETUP)
  } catch (error) {
    loginError.value = '暂时无法开启演示体验，请稍后重试。'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <AppPageShell
    title="开启你的自然旅程"
    description="当前使用 Mock 身份保存演示数据，真实微信登录将在页面闭环稳定后接入。"
    :status="status"
    :button-label="isSubmitting ? '正在开启…' : '使用演示身份继续'"
    @primary="startMockExperience"
  />
</template>
