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
        class="surface-card course-card"
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
  font-size: 24rpx;
  font-weight: 600;
  letter-spacing: 4rpx;
}

.garden-page__title {
  display: block;
  margin-top: 12rpx;
  font-size: 44rpx;
  font-weight: 600;
  line-height: 1.3;
}

.garden-page__description {
  display: block;
  margin-top: 20rpx;
  color: var(--color-text-secondary);
}

.garden-page__list {
  display: grid;
  gap: 24rpx;
  margin-top: 40rpx;
}

.course-card {
  display: flex;
  align-items: center;
  padding: 28rpx 32rpx;
}

.course-card__sense {
  min-width: 72rpx;
  color: var(--color-primary-deep);
  font-size: 24rpx;
}

.course-card__title {
  flex: 1;
  font-weight: 600;
}

.course-card__action {
  color: var(--color-text-muted);
  font-size: 24rpx;
}
</style>
