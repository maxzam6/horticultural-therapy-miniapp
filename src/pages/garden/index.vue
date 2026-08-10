<script setup>
import { mockCourses } from '@/mock'
import { ROUTES } from '@/config/routes'
import { goTo } from '@/services/navigation'

const openCourse = (courseId) => goTo(`${ROUTES.COURSE_DETAIL}?id=${courseId}`)
</script>

<template>
  <view class="page-container garden-page">
    <text class="garden-page__eyebrow">五感花园</text>
    <text class="garden-page__title">选择一种与自然连接的方式</text>
    <text class="garden-page__description">课程使用 Mock 数据，多肉种植是当前默认推荐。</text>

    <view class="garden-page__list">
      <view
        v-for="course in mockCourses"
        :key="course.id"
        class="surface-card surface-card--interactive course-card"
        @click="openCourse(course.id)"
      >
        <text class="course-card__sense">{{ course.senseName }}</text>
        <text class="course-card__title">{{ course.title }}</text>
        <text class="course-card__action">查看体验</text>
      </view>
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

.garden-page__title {
  display: block;
  margin-top: var(--space-2);
  font-size: var(--font-size-page-title);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-tight);
}

.garden-page__description {
  display: block;
  margin-top: var(--space-3);
  color: var(--color-text-secondary);
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
