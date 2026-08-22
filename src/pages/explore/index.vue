<script setup>
import { computed, ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import AppButton from '@/components/AppButton.vue'
import AppCard from '@/components/AppCard.vue'
import { ROUTES } from '@/config/routes'
import { goTo } from '@/services/navigation'
import { useAssessmentStore } from '@/stores/assessment'
import { useExperienceStore } from '@/stores/experience'
import { useUserStore } from '@/stores/user'

const assessmentStore = useAssessmentStore()
const experienceStore = useExperienceStore()
const userStore = useUserStore()
const isLoading = ref(false)

const senseIcons = {
  visual: '目',
  touch: '触',
  smell: '香',
  taste: '味',
  hearing: '听',
}

const nickname = computed(() => userStore.user?.nickname || '自然体验者')
const overviewScore = computed(() => assessmentStore.result?.experienceOverviewScore)
const hasAssessment = computed(() => Number.isFinite(Number(overviewScore.value)))

const recommendedCourse = computed(() => {
  const resultId = assessmentStore.result?.recommendedCourseId
  const matched = experienceStore.courses.find((course) => (
    course.id === resultId || String(course.id) === String(resultId)
  ))
  return matched
    || experienceStore.courses.find((course) => course.id === 'course-succulent')
    || experienceStore.courses[0]
})

const progress = computed(() => {
  const completed = new Set(
    experienceStore.records
      .map((record) => record.courseId)
      .filter(Boolean),
  ).size
  return Math.min(completed, 5)
})

const openGarden = () => goTo(ROUTES.GARDEN)
const retakeAssessment = () => goTo(ROUTES.ASSESSMENT_INTRO)

onShow(async () => {
  isLoading.value = true
  try {
    const latestAssessmentRequest = assessmentStore.result
      ? Promise.resolve(assessmentStore.result)
      : assessmentStore.loadLatestResult()

    await Promise.allSettled([
      latestAssessmentRequest,
      userStore.loadCurrentUser(),
      experienceStore.loadCourses(),
      experienceStore.loadRecords(),
    ])
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <view class="page-container explore-page">
    <view class="explore-hero">
      <image
        class="explore-hero__image"
        src="/static/illustrations/sensory-garden.jpg"
        mode="aspectFill"
      />
      <view class="explore-hero__shade" />
      <view class="explore-hero__copy">
        <text class="explore-hero__eyebrow">欢迎回来，{{ nickname }}</text>
        <text class="explore-hero__title">今天，想从哪一种感受开始？</text>
        <text class="explore-hero__description">让视觉、触觉、嗅觉、味觉与听觉带你重新靠近自然。</text>
      </view>
    </view>

    <view class="overview-row">
      <AppCard padding="compact">
        <view class="overview-card">
          <text class="overview-card__label">最近状态探索</text>
          <template v-if="hasAssessment">
            <view class="overview-card__score-row">
              <view class="overview-card__score-value">
                <text class="overview-card__score">{{ overviewScore }}</text>
                <text class="overview-card__unit">分</text>
              </view>
              <button class="overview-card__retake" @click="retakeAssessment">重新评估</button>
            </view>
            <text class="overview-card__caption">状态体验概览分 · 仅用于体验反馈</text>
          </template>
          <template v-else>
            <text class="overview-card__empty">从一场自然体验开始，也很好。</text>
          </template>
        </view>
      </AppCard>
    </view>

    <view class="section-heading">
      <text class="section-heading__eyebrow">为你推荐</text>
      <text class="section-heading__title">今天的自然练习</text>
    </view>

    <AppCard v-if="recommendedCourse" interactive padding="none" @click="openGarden">
      <view class="recommendation">
        <view class="recommendation__badge">优先推荐</view>
        <text class="recommendation__sense">{{ recommendedCourse.senseName }}体验</text>
        <text class="recommendation__title">{{ recommendedCourse.title }}</text>
        <text class="recommendation__description">
          {{ hasAssessment ? '根据你最近的状态探索，为你匹配一段轻松的自然体验。' : '从触摸与种植开始，用一株小小的多肉感受生命力。' }}
        </text>
        <text class="recommendation__link">去五感花园看看 →</text>
      </view>
    </AppCard>

    <view class="section-heading">
      <text class="section-heading__eyebrow">五感花园</text>
      <text class="section-heading__title">五种靠近自然的方式</text>
    </view>

    <view class="sense-list" :class="{ 'sense-list--loading': isLoading }">
      <view
        v-for="course in experienceStore.courses"
        :key="course.id"
        class="sense-item"
        @click="openGarden"
      >
        <text class="sense-item__icon">{{ senseIcons[course.sense] || '叶' }}</text>
        <text class="sense-item__name">{{ course.senseName }}</text>
      </view>
    </view>

    <AppCard padding="compact">
      <view class="mindfulness-card">
        <text class="mindfulness-card__mark">“</text>
        <view>
          <text class="mindfulness-card__title">此刻的自然提醒</text>
          <text class="mindfulness-card__description">慢一点，留意一片叶子的颜色、纹理和呼吸。</text>
        </view>
      </view>
    </AppCard>

    <view class="journey-progress">
      <view class="journey-progress__copy">
        <text class="journey-progress__label">我的自然旅程</text>
        <text class="journey-progress__value">已体验 {{ progress }} / 5 种感官</text>
      </view>
      <view class="journey-progress__track">
        <view class="journey-progress__fill" :style="{ width: `${progress * 20}%` }" />
      </view>
    </view>

    <AppButton @click="openGarden">进入五感花园</AppButton>
  </view>
</template>

<style lang="scss" scoped>
.explore-page {
  padding-top: calc(var(--space-3) + env(safe-area-inset-top));
  padding-bottom: calc(var(--space-6) + env(safe-area-inset-bottom));
}

.explore-hero {
  position: relative;
  min-height: 560rpx;
  overflow: hidden;
  border-radius: 36rpx;
  background: var(--color-primary-deep);
}

.explore-hero__image,
.explore-hero__shade {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.explore-hero__shade {
  background: linear-gradient(180deg, rgba(27, 46, 28, 0.08), rgba(27, 46, 28, 0.78));
}

.explore-hero__copy {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  min-height: 480rpx;
  padding: var(--space-4);
  color: #fffdf6;
}

.explore-hero__eyebrow,
.section-heading__eyebrow {
  margin-bottom: var(--space-2);
  color: #dcebcf;
  font-size: var(--font-size-caption);
  font-weight: var(--font-weight-semibold);
  letter-spacing: 4rpx;
}

.explore-hero__title {
  font-size: 44rpx;
  font-weight: var(--font-weight-bold);
  line-height: 1.35;
}

.explore-hero__description {
  margin-top: var(--space-2);
  color: rgba(255, 253, 246, 0.86);
  font-size: var(--font-size-caption);
  line-height: 1.6;
}

.overview-row {
  position: relative;
  z-index: 2;
  margin: -44rpx var(--space-3) 0;
}

.overview-card {
  display: flex;
  flex-direction: column;
}

.overview-card__label,
.overview-card__caption,
.overview-card__empty {
  color: var(--color-text-secondary);
  font-size: var(--font-size-caption);
}

.overview-card__score-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin: var(--space-1) 0;
}

.overview-card__score-value {
  display: flex;
  align-items: baseline;
}

.overview-card__retake {
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  min-height: 64rpx;
  margin: 0;
  padding: 0 28rpx;
  border: 0;
  border-radius: var(--radius-button);
  background: var(--color-bg-soft);
  color: var(--color-primary-deep);
  font-size: var(--font-size-caption);
  font-weight: var(--font-weight-semibold);
  line-height: 1;
}

.overview-card__retake::after {
  border: 0;
}

.overview-card__retake:active {
  opacity: 0.9;
  transform: scale(0.98);
}

.overview-card__score {
  color: var(--color-primary-deep);
  font-size: 50rpx;
  font-weight: var(--font-weight-bold);
}

.overview-card__unit {
  margin-left: 4rpx;
  color: var(--color-text-secondary);
  font-size: var(--font-size-caption);
}

.overview-card__empty {
  margin-top: var(--space-2);
  color: var(--color-text-primary);
}

.section-heading {
  display: flex;
  flex-direction: column;
  padding: var(--space-5) var(--space-1) var(--space-3);
}

.section-heading__eyebrow {
  color: var(--color-primary);
}

.section-heading__title {
  color: var(--color-text-primary);
  font-size: var(--font-size-title);
  font-weight: var(--font-weight-bold);
}

.recommendation {
  display: flex;
  flex-direction: column;
  padding: var(--space-4);
  background: linear-gradient(135deg, var(--color-bg-soft), #f8edd6);
}

.recommendation__badge {
  align-self: flex-start;
  padding: 6rpx 16rpx;
  border-radius: var(--radius-tag);
  background: var(--color-primary);
  color: var(--color-on-primary);
  font-size: 22rpx;
}

.recommendation__sense {
  margin-top: var(--space-3);
  color: var(--color-primary);
  font-size: var(--font-size-caption);
}

.recommendation__title {
  margin-top: 4rpx;
  color: var(--color-text-primary);
  font-size: 38rpx;
  font-weight: var(--font-weight-bold);
}

.recommendation__description {
  margin-top: var(--space-2);
  color: var(--color-text-secondary);
  font-size: var(--font-size-caption);
  line-height: 1.6;
}

.recommendation__link {
  margin-top: var(--space-3);
  color: var(--color-primary-deep);
  font-size: var(--font-size-caption);
  font-weight: var(--font-weight-semibold);
}

.sense-list {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--space-4);
  transition: opacity 120ms ease;
}

.sense-list--loading {
  opacity: 0.55;
}

.sense-item {
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 19%;
}

.sense-item__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 82rpx;
  height: 82rpx;
  border-radius: 50%;
  background: var(--color-bg-soft);
  color: var(--color-primary-deep);
  font-size: var(--font-size-caption);
  font-weight: var(--font-weight-bold);
}

.sense-item__name {
  margin-top: var(--space-1);
  color: var(--color-text-secondary);
  font-size: 22rpx;
}

.mindfulness-card {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
}

.mindfulness-card__mark {
  color: var(--color-primary);
  font-family: serif;
  font-size: 60rpx;
  line-height: 1;
}

.mindfulness-card__title,
.mindfulness-card__description {
  display: block;
}

.mindfulness-card__title {
  color: var(--color-text-primary);
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-semibold);
}

.mindfulness-card__description {
  margin-top: 4rpx;
  color: var(--color-text-secondary);
  font-size: var(--font-size-caption);
  line-height: 1.55;
}

.journey-progress {
  margin: var(--space-4) 0;
  padding: var(--space-3);
  border-radius: var(--radius-card);
  background: var(--color-surface);
}

.journey-progress__copy {
  display: flex;
  justify-content: space-between;
  color: var(--color-text-secondary);
  font-size: var(--font-size-caption);
}

.journey-progress__label {
  color: var(--color-text-primary);
  font-weight: var(--font-weight-semibold);
}

.journey-progress__track {
  height: 12rpx;
  margin-top: var(--space-2);
  overflow: hidden;
  border-radius: var(--radius-tag);
  background: var(--color-bg-soft);
}

.journey-progress__fill {
  height: 100%;
  border-radius: inherit;
  background: var(--color-primary);
}
</style>
