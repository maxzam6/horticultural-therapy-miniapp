<script setup>
const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary'].includes(value),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['click'])

function handleClick() {
  if (props.disabled || props.loading) return
  emit('click')
}
</script>

<template>
  <button
    class="app-button"
    :class="[
      `app-button--${variant}`,
      { 'app-button--disabled': disabled || loading },
    ]"
    :disabled="disabled || loading"
    :loading="loading"
    data-eventsync="true"
    @click="handleClick"
  >
    <slot />
  </button>
</template>

<style lang="scss" scoped>
.app-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: var(--control-height);
  margin: 0;
  border-radius: var(--radius-button);
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-semibold);
  line-height: 1;
  transition: opacity 120ms ease, transform 120ms ease;
}

.app-button--primary {
  background: var(--color-primary);
  color: var(--color-on-primary);
}

.app-button--secondary {
  background: var(--color-bg-soft);
  color: var(--color-primary-deep);
}

.app-button:active {
  opacity: 0.9;
  transform: scale(0.98);
}

.app-button--disabled {
  opacity: 0.45;
}
</style>
