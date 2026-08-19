<script setup>
const props = defineProps({
  interactive: {
    type: Boolean,
    default: false,
  },
  padding: {
    type: String,
    default: 'normal',
    validator: (value) => ['normal', 'compact', 'none'].includes(value),
  },
})

const emit = defineEmits(['click'])

function handleClick() {
  if (!props.interactive) return
  emit('click')
}
</script>

<template>
  <view
    class="app-card"
    :class="[`app-card--${padding}`, { 'app-card--interactive': interactive }]"
    :hover-class="interactive ? 'app-card--pressed' : 'none'"
    :hover-stay-time="120"
    data-eventsync="true"
    @click="handleClick"
  >
    <slot />
  </view>
</template>

<style lang="scss" scoped>
.app-card {
  border: 1rpx solid var(--color-border);
  border-radius: var(--radius-card);
  background: var(--color-surface);
  box-shadow: var(--shadow-card);
}

.app-card--normal {
  padding: var(--space-4);
}

.app-card--compact {
  padding: var(--space-3);
}

.app-card--none {
  padding: 0;
}

.app-card--interactive {
  transition: opacity 120ms ease, transform 120ms ease, box-shadow 120ms ease;
}

.app-card--pressed {
  box-shadow: var(--shadow-card-pressed);
  opacity: 0.96;
  transform: scale(0.99);
}
</style>
