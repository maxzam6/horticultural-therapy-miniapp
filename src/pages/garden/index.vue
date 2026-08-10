<script setup>
import AppCard from '@/components/AppCard.vue'
import AppSectionHeader from '@/components/AppSectionHeader.vue'
import { mockCourses } from '@/mock'
import { ROUTES } from '@/config/routes'
import { goTo } from '@/services/navigation'

const openCourse = (courseId) => goTo(`${ROUTES.COURSE_DETAIL}?id=${courseId}`)
</script>

<template>
  <view class="page-container garden-page">
    <text class="garden-page__eyebrow">五感花园</text>
    <view class="garden-page__header">
      <AppSectionHeader
        title="选择一种与自然连接的方式"
        description="课程使用 Mock 数据，多肉种植是当前默认推荐。"
      />
    </view>

    <view class="garden-page__list">
      <AppCard
        v-for="course in mockCourses"
        :key="course.id"
        interactive
        padding="none"
        @click="openCourse(course.id)"
      >
        <view class="course-card">
          <text class="course-card__sense">{{ course.senseName }}</text>
          <text class="course-card__title">{{ course.title }}</text>
          <text class="course-card__action">查看体验</text>
        </view>
      </AppCard>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.garden-page__eyebrow {
  color: var(--color-primary-deep);
  font-size: var(--font-size-caption);
  font-weight: var(--font-weight-semibold);
  letter-spacing: 4rpx;
}

.garden-page__header {
  margin-top: var(--space-2);
}

.garden-page__list {
  display: grid;
  gap: var(--space-3);
  margin-top: var(--space-5);
}

.course-card {
  display: flex;
  align-items: center;
  min-height: var(--touch-target-min);
  padding: var(--space-3) var(--space-4);
}

.course-card__sense {
  min-width: 72rpx;
  color: var(--color-primary-deep);
  font-size: var(--font-size-caption);
}

.course-card__title {
  flex: 1;
  font-weight: var(--font-weight-semibold);
}

.course-card__action {
  color: var(--color-text-muted);
  font-size: var(--font-size-caption);
}
</style>
