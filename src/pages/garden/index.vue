<script setup>
import { computed, ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import AppCard from '@/components/AppCard.vue'
import AppStateView from '@/components/AppStateView.vue'
import { ROUTES } from '@/config/routes'
import { goTo } from '@/services/navigation'
import { useExperienceStore } from '@/stores/experience'

const experienceStore = useExperienceStore()
const pageState = ref('loading')
const pageError = ref('')

const coursePresentation = {
  visual: { icon: '目', tagline: '观察叶片的形状与色彩', duration: '约 15 分钟', tone: 'sage' },
  touch: { icon: '触', tagline: '在种植中感受生命力', duration: '约 20 分钟', tone: 'clay' },
  smell: { icon: '香', tagline: '辨认草木温柔的气息', duration: '约 15 分钟', tone: 'lavender' },
  taste: { icon: '味', tagline: '品尝植物带来的层次', duration: '约 20 分钟', tone: 'amber' },
  hearing: { icon: '听', tagline: '听见风与叶子的节奏', duration: '约 15 分钟', tone: 'mist' },
}

const courses = computed(() => experienceStore.courses.slice(0, 5))
const recommendedCourse = computed(() => (
  courses.value.find((course) => course.id === 'course-succulent') || courses.value[0]
))

function presentationFor(course) {
  return coursePresentation[course.sense] || {
    icon: '叶', tagline: '用感官靠近自然', duration: '约 15 分钟', tone: 'sage',
  }
}

async function loadGarden() {
  pageState.value = 'loading'
  pageError.value = ''
  try {
    await experienceStore.loadCourses()
    pageState.value = experienceStore.courses.length ? 'ready' : 'empty'
  } catch {
    pageError.value = '五感体验暂时没有加载成功，请再试一次。'
    pageState.value = 'error'
  }
}

onShow(loadGarden)

const openCourse = (courseId) => {
  experienceStore.selectCourse(courseId)
  goTo(`${ROUTES.COURSE_DETAIL}?id=${courseId}`)
}
</script>

<template>
  <view class="page-container garden-page">
    <view class="garden-hero">
      <image
        class="garden-hero__image"
        src="/static/illustrations/sensory-garden.jpg"
        mode="aspectFill"
      />
      <view class="garden-hero__shade" />
      <view class="garden-hero__copy">
        <text class="garden-hero__eyebrow">五感花园</text>
        <text class="garden-hero__title">用五种感受，与自然重新相遇</text>
        <text class="garden-hero__description">不必着急完成，选择此刻最想靠近的一种体验。</text>
      </view>
    </view>

    <AppStateView
      v-if="pageState === 'loading'"
      state="loading"
      title="正在打开五感花园"
      description="请稍等，让自然体验慢慢展开。"
    />

    <AppStateView
      v-else-if="pageState === 'error'"
      state="error"
      :description="pageError"
      action-label="重新加载"
      @retry="loadGarden"
    />

    <AppStateView
      v-else-if="pageState === 'empty'"
      state="empty"
      title="花园正在准备中"
      description="体验内容稍后就会来到这里。"
      action-label="重新加载"
      @retry="loadGarden"
    />

    <template v-else>
      <view class="section-heading">
        <text class="section-heading__eyebrow">今日推荐</text>
        <text class="section-heading__title">从多肉种植开始</text>
      </view>

      <AppCard
        v-if="recommendedCourse"
        interactive
        padding="none"
        @click="openCourse(recommendedCourse.id)"
      >
        <view class="featured-course">
          <view class="featured-course__visual">
            <text class="featured-course__icon">{{ presentationFor(recommendedCourse).icon }}</text>
            <text class="featured-course__sense">{{ recommendedCourse.senseName }}体验</text>
          </view>
          <view class="featured-course__copy">
            <text class="featured-course__badge">默认推荐</text>
            <text class="featured-course__title">{{ recommendedCourse.title }}</text>
            <text class="featured-course__description">{{ presentationFor(recommendedCourse).tagline }}</text>
            <text class="featured-course__action">开始了解 →</text>
          </view>
        </view>
      </AppCard>

      <view class="section-heading">
        <text class="section-heading__eyebrow">选择一种感受</text>
        <text class="section-heading__title">五种自然体验</text>
      </view>

      <view class="garden-page__list">
        <AppCard
          v-for="course in courses"
          :key="course.id"
          interactive
          padding="none"
          @click="openCourse(course.id)"
        >
          <view class="course-card" :class="`course-card--${presentationFor(course).tone}`">
            <view class="course-card__visual">
              <text class="course-card__icon">{{ presentationFor(course).icon }}</text>
              <text class="course-card__sense">{{ course.senseName }}</text>
            </view>
            <view class="course-card__copy">
              <text class="course-card__title">{{ course.title }}</text>
              <text class="course-card__description">{{ presentationFor(course).tagline }}</text>
              <text class="course-card__duration">{{ presentationFor(course).duration }}</text>
            </view>
            <text class="course-card__action">→</text>
          </view>
        </AppCard>
      </view>

      <view class="nature-note">
        <text class="nature-note__mark">一</text>
        <view>
          <text class="nature-note__title">自然体验提示</text>
          <text class="nature-note__description">跟随自己的节奏即可。若感到不适，可以随时停下并休息。</text>
        </view>
      </view>
    </template>
  </view>
</template>

<style lang="scss" scoped>
.garden-page {
  padding-top: calc(var(--space-3) + env(safe-area-inset-top));
  padding-bottom: calc(var(--space-6) + env(safe-area-inset-bottom));
}

.garden-hero {
  position: relative;
  min-height: 500rpx;
  overflow: hidden;
  border-radius: 36rpx;
  background: var(--color-primary-deep);
}

.garden-hero__image,
.garden-hero__shade {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.garden-hero__shade {
  background: linear-gradient(180deg, rgba(26, 45, 27, 0.06), rgba(26, 45, 27, 0.78));
}

.garden-hero__copy {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  min-height: 420rpx;
  padding: var(--space-4);
  color: #fffdf6;
}

.garden-hero__eyebrow,
.section-heading__eyebrow {
  margin-bottom: var(--space-2);
  color: #dcebcf;
  font-size: var(--font-size-caption);
  font-weight: var(--font-weight-semibold);
  letter-spacing: 4rpx;
}

.garden-hero__title {
  font-size: 44rpx;
  font-weight: var(--font-weight-bold);
  line-height: 1.35;
}

.garden-hero__description {
  margin-top: var(--space-2);
  color: rgba(255, 253, 246, 0.86);
  font-size: var(--font-size-caption);
  line-height: 1.6;
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

.featured-course {
  display: flex;
  min-height: 270rpx;
  background: linear-gradient(135deg, #dce9d3, #f4ead9);
}

.featured-course__visual {
  display: flex;
  flex: 0 0 210rpx;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background: rgba(92, 123, 82, 0.14);
}

.featured-course__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  background: var(--color-surface);
  color: var(--color-primary-deep);
  font-size: 38rpx;
  font-weight: var(--font-weight-bold);
}

.featured-course__sense {
  margin-top: var(--space-2);
  color: var(--color-primary-deep);
  font-size: var(--font-size-caption);
}

.featured-course__copy {
  display: flex;
  flex: 1;
  justify-content: center;
  flex-direction: column;
  padding: var(--space-3);
}

.featured-course__badge {
  align-self: flex-start;
  padding: 4rpx 12rpx;
  border-radius: var(--radius-tag);
  background: var(--color-primary);
  color: var(--color-on-primary);
  font-size: 22rpx;
}

.featured-course__title {
  margin-top: var(--space-2);
  color: var(--color-text-primary);
  font-size: 36rpx;
  font-weight: var(--font-weight-bold);
}

.featured-course__description,
.featured-course__action {
  margin-top: var(--space-1);
  color: var(--color-text-secondary);
  font-size: var(--font-size-caption);
}

.featured-course__action {
  margin-top: var(--space-3);
  color: var(--color-primary-deep);
  font-weight: var(--font-weight-semibold);
}

.garden-page__list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.course-card {
  display: flex;
  align-items: center;
  min-height: 210rpx;
  padding: var(--space-3);
}

.course-card--sage { background: linear-gradient(90deg, #e4eddd, #fffdf7); }
.course-card--clay { background: linear-gradient(90deg, #f1e1d5, #fffdf7); }
.course-card--lavender { background: linear-gradient(90deg, #ebe2ed, #fffdf7); }
.course-card--amber { background: linear-gradient(90deg, #f3e8c9, #fffdf7); }
.course-card--mist { background: linear-gradient(90deg, #dfeaec, #fffdf7); }

.course-card__visual {
  display: flex;
  flex: 0 0 112rpx;
  align-items: center;
  flex-direction: column;
}

.course-card__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 88rpx;
  height: 88rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.72);
  color: var(--color-primary-deep);
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-bold);
}

.course-card__sense {
  margin-top: var(--space-1);
  color: var(--color-primary-deep);
  font-size: 22rpx;
}

.course-card__copy {
  display: flex;
  flex: 1;
  flex-direction: column;
}

.course-card__title {
  color: var(--color-text-primary);
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-semibold);
}

.course-card__description,
.course-card__duration {
  margin-top: 4rpx;
  color: var(--color-text-secondary);
  font-size: var(--font-size-caption);
}

.course-card__duration {
  margin-top: var(--space-2);
  color: var(--color-primary);
}

.course-card__action {
  color: var(--color-primary);
  font-size: 36rpx;
}

.nature-note {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  margin-top: var(--space-4);
  padding: var(--space-3);
  border-radius: var(--radius-card);
  background: var(--color-bg-soft);
}

.nature-note__mark {
  color: var(--color-primary);
  font-size: 38rpx;
  font-weight: var(--font-weight-bold);
}

.nature-note__title,
.nature-note__description {
  display: block;
}

.nature-note__title {
  color: var(--color-text-primary);
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-semibold);
}

.nature-note__description {
  margin-top: 4rpx;
  color: var(--color-text-secondary);
  font-size: var(--font-size-caption);
  line-height: 1.55;
}
</style>
