<script setup>
import AppPageShell from '@/components/AppPageShell.vue'
import { ROUTES } from '@/config/routes'
import { goTo } from '@/services/navigation'

const startExperience = () => goTo(ROUTES.AUTH)
</script>

<template>
  <AppPageShell
    custom-navigation
    eyebrow="园艺疗法"
    title="连接自然，关注当下"
    description="从一次轻量的状态探索开始，走进五感花园，留下属于你的自然印记。"
    status="P01 首页工程骨架已就绪"
    button-label="开始体验"
    @primary="startExperience"
  >
    <view class="home-points">
      <text>了解此刻状态</text>
      <text>完成五感体验</text>
      <text>记录自然旅程</text>
    </view>
  </AppPageShell>
</template>

<style lang="scss" scoped>
.home-points {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-top: var(--space-2);
  color: var(--color-text-secondary);
  font-size: var(--font-size-caption);
}

.home-points text {
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-tag);
  background: var(--color-bg-soft);
}
</style>
