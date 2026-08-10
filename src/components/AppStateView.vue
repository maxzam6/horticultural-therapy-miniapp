<script setup>
import { computed } from 'vue'
import AppButton from './AppButton.vue'

const props = defineProps({
  state: {
    type: String,
    required: true,
    validator: (value) => ['loading', 'empty', 'error'].includes(value),
  },
  title: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  actionLabel: {
    type: String,
    default: '',
  },
})

defineEmits(['retry'])

const defaults = {
  loading: {
    title: '正在加载',
    description: '请稍等一下。',
  },
  empty: {
    title: '这里还没有内容',
    description: '完成第一次自然体验后，这里会慢慢丰富起来。',
  },
  error: {
    title: '暂时没有加载成功',
    description: '请稍后再试一次。',
  },
}

const resolvedTitle = computed(() => props.title || defaults[props.state].title)
const resolvedDescription = computed(
  () => props.description || defaults[props.state].description,
)
</script>

<template>
  <view class="state-view">
    <view v-if="state === 'loading'" class="state-view__spinner" />
    <view v-else class="state-view__botanical">
      <view class="state-view__stem" />
      <view class="state-view__leaf state-view__leaf--left" />
      <view class="state-view__leaf state-view__leaf--right" />
    </view>
    <text class="state-view__title">{{ resolvedTitle }}</text>
    <text class="state-view__description">{{ resolvedDescription }}</text>
    <view v-if="actionLabel" class="state-view__action">
      <AppButton variant="secondary" @click="$emit('retry')">
        {{ actionLabel }}
      </AppButton>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.state-view {
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: var(--space-8) var(--space-4);
  text-align: center;
}

.state-view__spinner {
  width: var(--space-6);
  height: var(--space-6);
  border: 4rpx solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: state-view-spin 800ms linear infinite;
}

.state-view__botanical {
  position: relative;
  width: var(--space-8);
  height: var(--space-8);
}

.state-view__stem {
  position: absolute;
  bottom: var(--space-1);
  left: 31rpx;
  width: 3rpx;
  height: var(--space-6);
  border-radius: 4rpx;
  background: var(--color-primary-deep);
}

.state-view__leaf {
  position: absolute;
  width: var(--space-4);
  height: var(--space-2);
  border-radius: 100% 0;
  background: var(--color-primary-light);
}

.state-view__leaf--left {
  top: var(--space-3);
  left: var(--space-1);
  transform: rotate(18deg);
}

.state-view__leaf--right {
  top: var(--space-1);
  right: 0;
  transform: rotate(105deg);
}

.state-view__title {
  margin-top: var(--space-3);
  color: var(--color-text);
  font-size: var(--font-size-card-title);
  font-weight: var(--font-weight-semibold);
}

.state-view__description {
  max-width: 520rpx;
  margin-top: var(--space-2);
  color: var(--color-text-secondary);
  font-size: var(--font-size-body-small);
  line-height: var(--line-height-body);
}

.state-view__action {
  width: 320rpx;
  margin-top: var(--space-4);
}

@keyframes state-view-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
