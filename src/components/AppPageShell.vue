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
})

defineEmits(['primary'])
</script>

<template>
  <view class="page-container page-shell">
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
  margin-bottom: 24rpx;
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
  font-size: 24rpx;
  font-weight: 600;
  letter-spacing: 4rpx;
}

.page-shell__title {
  margin-top: 12rpx;
  color: var(--color-text);
  font-size: 48rpx;
  font-weight: 600;
  line-height: 1.25;
}

.page-shell__description {
  margin-top: 20rpx;
  color: var(--color-text-secondary);
}

.page-shell__status {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  margin-top: 48rpx;
  padding: 32rpx;
}

.page-shell__status-label {
  color: var(--color-text-muted);
  font-size: 24rpx;
}

.page-shell__status-value {
  color: var(--color-primary-deep);
  font-weight: 600;
}

.page-shell__button {
  width: 100%;
  margin-top: 40rpx;
}
</style>
