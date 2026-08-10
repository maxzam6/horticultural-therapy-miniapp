<script setup>
import { computed } from 'vue'

const props = defineProps({
  value: {
    type: Number,
    default: 0,
  },
  label: {
    type: String,
    default: '',
  },
  showValue: {
    type: Boolean,
    default: true,
  },
})

const normalizedValue = computed(() => Math.min(100, Math.max(0, props.value)))
const progressStyle = computed(() => `width: ${normalizedValue.value}%`)
</script>

<template>
  <view class="app-progress">
    <view v-if="label || showValue" class="app-progress__meta">
      <text class="app-progress__label">{{ label }}</text>
      <text v-if="showValue" class="app-progress__value">{{ normalizedValue }}%</text>
    </view>
    <view class="app-progress__track">
      <view class="app-progress__bar" :style="progressStyle" />
    </view>
  </view>
</template>

<style lang="scss" scoped>
.app-progress {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  width: 100%;
}

.app-progress__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
}

.app-progress__label,
.app-progress__value {
  color: var(--color-text-secondary);
  font-size: var(--font-size-caption);
}

.app-progress__value {
  color: var(--color-primary-deep);
  font-weight: var(--font-weight-semibold);
}

.app-progress__track {
  overflow: hidden;
  width: 100%;
  height: var(--space-2);
  border-radius: var(--radius-tag);
  background: var(--color-border);
}

.app-progress__bar {
  height: 100%;
  border-radius: inherit;
  background: var(--color-primary);
  transition: width 300ms ease;
}
</style>
