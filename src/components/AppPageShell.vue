<script setup>
defineProps({
  eyebrow: {
    type: String,
    default: '园艺疗法',
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    default: '页面骨架已就绪',
  },
  buttonLabel: {
    type: String,
    default: '',
  },
  customNavigation: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['primary'])
</script>

<template>
  <view
    class="page-container page-shell"
    :class="{ 'page-container--custom-nav': customNavigation }"
  >
    <view class="page-shell__botanical">
      <view class="page-shell__stem" />
      <view class="page-shell__leaf page-shell__leaf--left" />
      <view class="page-shell__leaf page-shell__leaf--right" />
    </view>
    <text class="page-shell__eyebrow">{{ eyebrow }}</text>
    <text class="page-shell__title">{{ title }}</text>
    <text v-if="description" class="page-shell__description">{{ description }}</text>

    <view class="surface-card page-shell__status">
      <text class="page-shell__status-label">当前状态</text>
      <text class="page-shell__status-value">{{ status }}</text>
      <slot />
    </view>

    <button
      v-if="buttonLabel"
      class="primary-button page-shell__button"
      @click="$emit('primary')"
    >
      {{ buttonLabel }}
    </button>
  </view>
</template>

<style lang="scss" scoped>
.page-shell {
  display: flex;
  flex-direction: column;
}

.page-shell__botanical {
  position: relative;
  width: 64rpx;
  height: 64rpx;
  margin-bottom: var(--space-3);
}

.page-shell__stem {
  position: absolute;
  bottom: 8rpx;
  left: 31rpx;
  width: 3rpx;
  height: 48rpx;
  border-radius: 4rpx;
  background: var(--color-primary-deep);
  transform: rotate(8deg);
}

.page-shell__leaf {
  position: absolute;
  width: 30rpx;
  height: 18rpx;
  border-radius: 100% 0 100% 0;
  background: var(--color-primary-light);
}

.page-shell__leaf--left {
  top: 20rpx;
  left: 6rpx;
  transform: rotate(18deg);
}

.page-shell__leaf--right {
  top: 8rpx;
  right: 2rpx;
  transform: rotate(105deg);
}

.page-shell__eyebrow {
  color: var(--color-primary-deep);
  font-size: var(--font-size-caption);
  font-weight: var(--font-weight-semibold);
  letter-spacing: 4rpx;
}

.page-shell__title {
  margin-top: var(--space-2);
  color: var(--color-text);
  font-size: var(--font-size-hero);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-tight);
}

.page-shell__description {
  margin-top: var(--space-3);
  color: var(--color-text-secondary);
  line-height: var(--line-height-body);
}

.page-shell__status {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  margin-top: var(--space-6);
  padding: var(--space-4);
}

.page-shell__status-label {
  color: var(--color-text-muted);
  font-size: var(--font-size-caption);
}

.page-shell__status-value {
  color: var(--color-primary-deep);
  font-weight: var(--font-weight-semibold);
}

.page-shell__button {
  width: 100%;
  margin-top: var(--space-5);
}
</style>
