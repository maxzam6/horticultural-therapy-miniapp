<script setup>
import AppButton from '@/components/AppButton.vue'
import AppCard from '@/components/AppCard.vue'
import { ROUTES } from '@/config/routes'
import { goTo } from '@/services/navigation'

const values = [
  { icon: '叶', title: '自然连接', description: '在植物与日常之间，重新发现细小而真实的感受。' },
  { icon: '息', title: '情绪放松', description: '用轻量的五感活动，让注意力温柔地回到当下。' },
  { icon: '记', title: '成长记录', description: '把每一次体验收进自然旅程，看见自己的变化。' },
]

const quickEntries = [
  { label: '开始体验', description: '建立自然档案', route: ROUTES.AUTH },
  { label: '探索花园', description: '发现五感活动', route: ROUTES.EXPLORE },
  { label: '自然旅程', description: '回看体验记录', route: ROUTES.RECORDS },
]

const startExperience = () => goTo(ROUTES.AUTH)
const openEntry = (route) => goTo(route)
</script>

<template>
  <view class="page-container home-page">
    <view class="hero">
      <image class="hero__image" src="/static/illustrations/home-hero.jpg" mode="aspectFill" />
      <view class="hero__shade" />
      <view class="hero__content">
        <text class="hero__eyebrow">园艺疗法</text>
        <text class="hero__title">连接自然，疗愈身心</text>
        <text class="hero__description">
          从一次轻量的状态探索开始，走进五感花园，留下一枚属于你的自然印记。
        </text>
        <AppButton @click="startExperience">开始体验</AppButton>
      </view>
    </view>

    <view class="section intro">
      <text class="section__eyebrow">自然就在身边</text>
      <text class="section__title">给自己一段与植物相处的时间</text>
      <text class="section__description">
        这里没有复杂的指标，只有循序渐进的感受、体验与记录。
      </text>
    </view>

    <view class="value-list">
      <AppCard v-for="item in values" :key="item.title" padding="compact">
        <view class="value-card">
          <text class="value-card__icon">{{ item.icon }}</text>
          <view class="value-card__content">
            <text class="value-card__title">{{ item.title }}</text>
            <text class="value-card__description">{{ item.description }}</text>
          </view>
        </view>
      </AppCard>
    </view>

    <view class="section section--entries">
      <text class="section__eyebrow">快速入口</text>
      <text class="section__title">从此刻出发</text>
      <view class="entry-list">
        <AppCard
          v-for="entry in quickEntries"
          :key="entry.label"
          interactive
          padding="compact"
          @click="openEntry(entry.route)"
        >
          <view class="entry-card">
            <view>
              <text class="entry-card__title">{{ entry.label }}</text>
              <text class="entry-card__description">{{ entry.description }}</text>
            </view>
            <text class="entry-card__arrow">→</text>
          </view>
        </AppCard>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.home-page {
  padding-top: calc(var(--space-3) + env(safe-area-inset-top));
  padding-bottom: calc(var(--space-6) + env(safe-area-inset-bottom));
}

.hero {
  position: relative;
  min-height: 760rpx;
  overflow: hidden;
  border-radius: 36rpx;
  background: var(--color-primary-deep);
  box-shadow: var(--shadow-card);
}

.hero__image,
.hero__shade {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.hero__shade {
  background: linear-gradient(180deg, rgba(39, 62, 38, 0.08) 5%, rgba(31, 49, 30, 0.78) 78%);
}

.hero__content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  min-height: 680rpx;
  padding: var(--space-5);
  color: #fffdf6;
}

.hero__eyebrow,
.section__eyebrow {
  margin-bottom: var(--space-2);
  color: #d9e8c8;
  font-size: var(--font-size-caption);
  font-weight: var(--font-weight-semibold);
  letter-spacing: 6rpx;
}

.hero__title {
  margin-bottom: var(--space-2);
  font-size: 54rpx;
  font-weight: var(--font-weight-bold);
  line-height: 1.22;
}

.hero__description {
  margin-bottom: var(--space-4);
  color: rgba(255, 253, 246, 0.88);
  font-size: var(--font-size-body);
  line-height: 1.7;
}

.section {
  padding: var(--space-6) var(--space-1) var(--space-3);
}

.section--entries {
  padding-bottom: 0;
}

.section__eyebrow {
  display: block;
  color: var(--color-primary);
}

.section__title {
  display: block;
  color: var(--color-text-primary);
  font-size: var(--font-size-title);
  font-weight: var(--font-weight-bold);
  line-height: 1.35;
}

.section__description {
  display: block;
  margin-top: var(--space-2);
  color: var(--color-text-secondary);
  font-size: var(--font-size-body);
  line-height: 1.7;
}

.value-list,
.entry-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.value-card,
.entry-card {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.value-card__icon {
  display: flex;
  flex: 0 0 76rpx;
  align-items: center;
  justify-content: center;
  width: 76rpx;
  height: 76rpx;
  border-radius: 50%;
  background: var(--color-bg-soft);
  color: var(--color-primary-deep);
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-bold);
}

.value-card__content,
.entry-card > view {
  display: flex;
  flex: 1;
  flex-direction: column;
}

.value-card__title,
.entry-card__title {
  color: var(--color-text-primary);
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-semibold);
}

.value-card__description,
.entry-card__description {
  margin-top: 6rpx;
  color: var(--color-text-secondary);
  font-size: var(--font-size-caption);
  line-height: 1.55;
}

.entry-card__arrow {
  color: var(--color-primary);
  font-size: 40rpx;
}
</style>
