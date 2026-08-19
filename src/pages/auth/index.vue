<script setup>
import { computed, ref } from 'vue'
import AppButton from '@/components/AppButton.vue'
import AppCard from '@/components/AppCard.vue'
import { ROUTES } from '@/config/routes'
import { goTo } from '@/services/navigation'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const loginError = ref('')
const isSubmitting = ref(false)
const isBusy = computed(() => isSubmitting.value || userStore.loading)

async function startMockExperience() {
  if (isBusy.value) return
  isSubmitting.value = true
  loginError.value = ''
  try {
    await userStore.startMockSession()
    goTo(ROUTES.PROFILE_SETUP)
  } catch {
    loginError.value = '暂时无法开启演示体验，请稍后重试。'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <view class="page-container auth-page">
    <view class="auth-hero">
      <image
        class="auth-hero__image"
        src="/static/illustrations/growth-journey.jpg"
        mode="aspectFill"
      />
      <view class="auth-hero__shade" />
      <view class="auth-hero__copy">
        <text class="auth-hero__eyebrow">自然旅程 · 第一步</text>
        <text class="auth-hero__title">开启你的园艺疗法旅程</text>
      </view>
    </view>

    <view class="intro">
      <text class="intro__title">留住每一次自然体验</text>
      <text class="intro__description">
        开启演示身份后，你的自然档案、状态探索和体验记录会保存在本机，方便完整展示旅程。
      </text>
    </view>

    <view class="benefit-list">
      <view class="benefit-item">
        <text class="benefit-item__index">01</text>
        <text>建立专属自然档案</text>
      </view>
      <view class="benefit-item">
        <text class="benefit-item__index">02</text>
        <text>保存状态探索结果</text>
      </view>
      <view class="benefit-item">
        <text class="benefit-item__index">03</text>
        <text>收藏自然印记与记录</text>
      </view>
    </view>

    <AppCard padding="compact">
      <view class="identity-card">
        <view class="identity-card__avatar">芽</view>
        <view class="identity-card__copy">
          <text class="identity-card__label">当前体验方式</text>
          <text class="identity-card__title">演示身份</text>
          <text class="identity-card__description">无需授权，不会发起真实微信登录</text>
        </view>
      </view>
    </AppCard>

    <text v-if="loginError" class="error-message" role="alert">{{ loginError }}</text>

    <view class="auth-actions">
      <AppButton :loading="isBusy" :disabled="isBusy" @click="startMockExperience">
        {{ isBusy ? '正在开启…' : '使用演示身份继续' }}
      </AppButton>
      <text class="privacy-note">继续即表示你已了解：本项目仅用于大创展示，体验数据仅保存在本机。</text>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.auth-page {
  padding-top: calc(var(--space-3) + env(safe-area-inset-top));
  padding-bottom: calc(var(--space-6) + env(safe-area-inset-bottom));
}

.auth-hero {
  position: relative;
  height: 470rpx;
  overflow: hidden;
  border-radius: 36rpx;
  background: var(--color-bg-soft);
}

.auth-hero__image,
.auth-hero__shade {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.auth-hero__shade {
  background: linear-gradient(180deg, rgba(32, 51, 31, 0.02) 30%, rgba(32, 51, 31, 0.72));
}

.auth-hero__copy {
  position: absolute;
  right: var(--space-4);
  bottom: var(--space-4);
  left: var(--space-4);
  display: flex;
  flex-direction: column;
  color: #fffdf6;
}

.auth-hero__eyebrow {
  margin-bottom: var(--space-2);
  color: #dcebcf;
  font-size: var(--font-size-caption);
  font-weight: var(--font-weight-semibold);
  letter-spacing: 4rpx;
}

.auth-hero__title {
  font-size: 44rpx;
  font-weight: var(--font-weight-bold);
  line-height: 1.3;
}

.intro {
  padding: var(--space-5) var(--space-1) var(--space-3);
}

.intro__title,
.intro__description {
  display: block;
}

.intro__title {
  color: var(--color-text-primary);
  font-size: var(--font-size-title);
  font-weight: var(--font-weight-bold);
}

.intro__description {
  margin-top: var(--space-2);
  color: var(--color-text-secondary);
  font-size: var(--font-size-body);
  line-height: 1.7;
}

.benefit-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-card);
  background: var(--color-bg-soft);
  color: var(--color-text-primary);
  font-size: var(--font-size-body);
}

.benefit-item__index {
  color: var(--color-primary);
  font-size: var(--font-size-caption);
  font-weight: var(--font-weight-bold);
}

.identity-card {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.identity-card__avatar {
  display: flex;
  flex: 0 0 92rpx;
  align-items: center;
  justify-content: center;
  width: 92rpx;
  height: 92rpx;
  border-radius: 50%;
  background: var(--color-primary);
  color: var(--color-on-primary);
  font-weight: var(--font-weight-bold);
}

.identity-card__copy {
  display: flex;
  flex: 1;
  flex-direction: column;
}

.identity-card__label,
.identity-card__description,
.privacy-note {
  color: var(--color-text-secondary);
  font-size: var(--font-size-caption);
}

.identity-card__title {
  margin: 4rpx 0;
  color: var(--color-text-primary);
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-semibold);
}

.error-message {
  display: block;
  margin-top: var(--space-3);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-tag);
  background: #fff0ea;
  color: var(--color-error);
  font-size: var(--font-size-caption);
}

.auth-actions {
  margin-top: var(--space-4);
}

.privacy-note {
  display: block;
  margin-top: var(--space-2);
  text-align: center;
  line-height: 1.55;
}
</style>
