<script setup>
defineProps({
  title: {
    type: String,
    required: true,
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

defineEmits(['action'])
</script>

<template>
  <view class="section-header">
    <view class="section-header__content">
      <text class="section-header__title">{{ title }}</text>
      <text v-if="description" class="section-header__description">
        {{ description }}
      </text>
    </view>
    <button
      v-if="actionLabel"
      class="section-header__action"
      hover-class="section-header__action--pressed"
      @click="$emit('action')"
    >
      {{ actionLabel }}
    </button>
  </view>
</template>

<style lang="scss" scoped>
.section-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-3);
}

.section-header__content {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: var(--space-1);
}

.section-header__title {
  color: var(--color-text);
  font-size: var(--font-size-section-title);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-tight);
}

.section-header__description {
  color: var(--color-text-secondary);
  font-size: var(--font-size-body-small);
  line-height: var(--line-height-body);
}

.section-header__action {
  min-width: var(--touch-target-min);
  min-height: var(--touch-target-min);
  margin: calc(var(--space-2) * -1) 0 0;
  padding: 0 var(--space-2);
  background: transparent;
  color: var(--color-primary-deep);
  font-size: var(--font-size-caption);
  font-weight: var(--font-weight-medium);
  line-height: var(--touch-target-min);
}

.section-header__action--pressed {
  opacity: 0.65;
}
</style>
