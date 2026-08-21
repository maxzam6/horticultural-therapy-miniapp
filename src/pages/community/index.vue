<template>
  <view class="page-container community-page">
    <view class="community-page__illustration">
      <image src="/static/illustrations/sensory-garden.jpg" mode="aspectFill" />
      <view class="community-page__shade" />
      <text class="community-page__mark">叶</text>
    </view>
    <text class="community-page__eyebrow">自然相遇</text>
    <text class="community-page__title">自然分享空间</text>
    <text class="community-page__description">自然分享空间，未来开放。</text>
  </view>
</template>

<style lang="scss" scoped>
.community-page { display: flex; align-items: center; min-height: 75vh; flex-direction: column; justify-content: center; text-align: center; }
.community-page__illustration { position: relative; width: 280rpx; height: 280rpx; overflow: hidden; border-radius: 50%; box-shadow: var(--shadow-card); }
.community-page__illustration image, .community-page__shade { position: absolute; inset: 0; width: 100%; height: 100%; }
.community-page__shade { background: rgba(47, 59, 46, 0.2); }
.community-page__mark { position: relative; display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; color: var(--color-on-primary); font-size: 64rpx; font-weight: var(--font-weight-semibold); }
.community-page__eyebrow { margin-top: var(--space-6); color: var(--color-primary); font-size: var(--font-size-caption); font-weight: var(--font-weight-semibold); letter-spacing: 4rpx; }
.community-page__title { margin-top: var(--space-2); color: var(--color-text); font-size: var(--font-size-hero); font-weight: var(--font-weight-semibold); }
.community-page__description { margin-top: var(--space-3); color: var(--color-text-secondary); line-height: var(--line-height-body); }
</style>
