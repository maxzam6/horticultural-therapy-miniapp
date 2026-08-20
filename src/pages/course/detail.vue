<script setup>
import { computed, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import AppButton from '@/components/AppButton.vue'
import AppCard from '@/components/AppCard.vue'
import AppStateView from '@/components/AppStateView.vue'
import { ROUTES } from '@/config/routes'
import { goTo } from '@/services/navigation'
import { useExperienceStore } from '@/stores/experience'

const experienceStore = useExperienceStore()
const courseId = ref('course-succulent')
const pageState = ref('loading')
const pageError = ref('')
const isStarting = ref(false)

const course = computed(() => experienceStore.courses.find((item) => item.id === courseId.value) || null)
const coverImage = computed(() => course.value?.cover || '/static/illustrations/sensory-garden.jpg')
const steps = computed(() => Array.isArray(course.value?.steps) ? course.value.steps : [])
const materials = computed(() => Array.isArray(course.value?.materials) ? course.value.materials : [])
const safetyTips = computed(() => Array.isArray(course.value?.safetyTips) ? course.value.safetyTips : [])

function decodeParam(value, fallback = '') {
  if (!value) return fallback
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

async function loadCourse() {
  pageState.value = 'loading'
  pageError.value = ''
  try {
    await experienceStore.loadCourses()
    pageState.value = course.value ? 'ready' : 'empty'
  } catch (error) {
    pageError.value = error?.message || '课程暂时没有加载成功，请稍后再试。'
    pageState.value = 'error'
  }
}

onLoad(async (options) => {
  courseId.value = decodeParam(options?.id, 'course-succulent')
  await loadCourse()
})

function goBack() {
  uni.navigateBack()
}

function resolveSessionAction() {
  return ['startSession', 'startExperienceSession', 'createSession']
    .find((name) => typeof experienceStore[name] === 'function')
}

async function startTask() {
  if (isStarting.value || !course.value) return
  isStarting.value = true
  pageError.value = ''
  try {
    const actionName = resolveSessionAction()
    if (!actionName) throw new Error('体验 Session 服务尚未接入，请稍后再试。')
    const session = await experienceStore[actionName](course.value.id)
    const sessionId = session?.id || session?.sessionId
    if (!sessionId) throw new Error('体验 Session 创建失败，请稍后再试。')
    goTo(`${ROUTES.EXPERIENCE_TASK}?sessionId=${encodeURIComponent(sessionId)}`)
  } catch (error) {
    pageError.value = error?.message || '暂时无法开始体验，请稍后再试。'
  } finally {
    isStarting.value = false
  }
}
</script>

<template>
  <view class="page-container course-detail-page">
    <view class="detail-nav">
      <text class="detail-nav__back" @click="goBack">‹</text>
      <text class="detail-nav__title">自然体验</text>
      <view class="detail-nav__spacer" />
    </view>

    <AppStateView v-if="pageState === 'loading'" state="loading" title="正在准备体验" description="让课程内容慢慢展开。" />
    <AppStateView v-else-if="pageState === 'error'" state="error" :description="pageError" action-label="重新加载" @retry="loadCourse" />
    <AppStateView v-else-if="pageState === 'empty'" state="empty" title="暂时找不到这门体验" description="请从五感花园重新选择一门课程。" />

    <template v-else-if="course">
      <view class="course-hero">
        <image class="course-hero__image" :src="coverImage" mode="aspectFill" />
        <view class="course-hero__shade" />
        <view class="course-hero__copy">
          <text class="course-hero__sense">{{ course.senseName || '自然体验' }}</text>
          <text class="course-hero__title">{{ course.title }}</text>
          <text class="course-hero__subtitle">{{ course.subtitle || '从一株小小的植物开始，和自然待在一起。' }}</text>
        </view>
      </view>

      <view class="course-meta">
        <AppCard padding="compact">
          <view class="course-meta__item">
            <text class="course-meta__label">体验时长</text>
            <text class="course-meta__value">{{ course.duration || '约 20 分钟' }}</text>
          </view>
        </AppCard>
        <AppCard padding="compact">
          <view class="course-meta__item">
            <text class="course-meta__label">体验方式</text>
            <text class="course-meta__value">{{ course.senseName || '五感探索' }}</text>
          </view>
        </AppCard>
      </view>

      <AppCard>
        <view class="content-block">
          <text class="content-block__eyebrow">课程介绍</text>
          <text class="content-block__title">给自己一段慢下来的时间</text>
          <text class="content-block__body">{{ course.description || '在简单、温和的种植步骤中，留意手指、泥土和植物带来的细小感受。无需追求完美，按照自己的节奏完成即可。' }}</text>
        </view>
      </AppCard>

      <AppCard v-if="materials.length">
        <view class="content-block">
          <text class="content-block__eyebrow">准备材料</text>
          <view class="bullet-list">
            <view v-for="material in materials" :key="material" class="bullet-list__item">
              <text class="bullet-list__mark">叶</text>
              <text class="bullet-list__text">{{ material }}</text>
            </view>
          </view>
        </view>
      </AppCard>

      <AppCard>
        <view class="content-block">
          <text class="content-block__eyebrow">体验步骤</text>
          <view v-if="steps.length" class="step-list">
            <view v-for="(step, index) in steps" :key="step.id || index" class="step-list__item">
              <view class="step-list__number">{{ String(index + 1).padStart(2, '0') }}</view>
              <view class="step-list__copy">
                <text class="step-list__title">{{ step.title || `步骤 ${index + 1}` }}</text>
                <text class="step-list__body">{{ step.description || '跟随页面提示，按自己的节奏完成。' }}</text>
              </view>
            </view>
          </view>
          <text v-else class="content-block__body">详细步骤将在体验任务中逐步展开。</text>
        </view>
      </AppCard>

      <AppCard v-if="course.mindfulnessPrompt" padding="compact">
        <view class="prompt-card">
          <text class="prompt-card__mark">“</text>
          <text class="prompt-card__text">{{ course.mindfulnessPrompt }}</text>
        </view>
      </AppCard>

      <AppCard v-if="safetyTips.length" padding="compact">
        <view class="safety-card">
          <text class="safety-card__title">温和提醒</text>
          <text v-for="tip in safetyTips" :key="tip" class="safety-card__item">{{ tip }}</text>
        </view>
      </AppCard>

      <AppStateView v-if="pageError" state="error" :description="pageError" />
      <AppButton :loading="isStarting" @click="startTask">开始体验</AppButton>
    </template>
  </view>
</template>

<style lang="scss" scoped>
.course-detail-page { display: flex; flex-direction: column; gap: var(--space-4); padding-top: calc(var(--space-2) + env(safe-area-inset-top)); padding-bottom: calc(var(--space-6) + env(safe-area-inset-bottom)); }
.detail-nav { display: flex; align-items: center; min-height: 72rpx; }
.detail-nav__back { width: 64rpx; color: var(--color-text-primary); font-size: 64rpx; line-height: 0.8; }
.detail-nav__title { flex: 1; color: var(--color-text-primary); font-size: var(--font-size-body); font-weight: var(--font-weight-semibold); text-align: center; }
.detail-nav__spacer { width: 64rpx; }
.course-hero { position: relative; min-height: 520rpx; overflow: hidden; border-radius: var(--radius-hero); background: var(--color-primary-deep); box-shadow: var(--shadow-card); }
.course-hero__image, .course-hero__shade { position: absolute; inset: 0; width: 100%; height: 100%; }
.course-hero__shade { background: linear-gradient(180deg, rgba(35, 58, 35, 0.05), rgba(35, 58, 35, 0.82)); }
.course-hero__copy { position: relative; display: flex; min-height: 460rpx; justify-content: flex-end; flex-direction: column; padding: var(--space-5); color: #fffdf6; }
.course-hero__sense { color: #dcebcf; font-size: var(--font-size-caption); font-weight: var(--font-weight-semibold); letter-spacing: 4rpx; }
.course-hero__title { margin-top: var(--space-2); font-size: 52rpx; font-weight: var(--font-weight-bold); line-height: 1.25; }
.course-hero__subtitle { margin-top: var(--space-2); color: rgba(255, 253, 246, 0.88); font-size: var(--font-size-caption); line-height: 1.6; }
.course-meta { display: flex; gap: var(--space-3); }
.course-meta > .app-card { flex: 1; }
.course-meta__item { display: flex; flex-direction: column; gap: var(--space-1); }
.course-meta__label { color: var(--color-text-muted); font-size: var(--font-size-caption); }
.course-meta__value { color: var(--color-primary-deep); font-size: var(--font-size-body); font-weight: var(--font-weight-semibold); }
.content-block { display: flex; flex-direction: column; }
.content-block__eyebrow { color: var(--color-primary); font-size: var(--font-size-caption); font-weight: var(--font-weight-semibold); letter-spacing: 3rpx; }
.content-block__title { margin-top: var(--space-2); color: var(--color-text-primary); font-size: var(--font-size-section-title); font-weight: var(--font-weight-bold); line-height: 1.35; }
.content-block__body { margin-top: var(--space-2); color: var(--color-text-secondary); font-size: var(--font-size-body-small); line-height: 1.7; }
.bullet-list, .step-list { display: flex; flex-direction: column; gap: var(--space-3); margin-top: var(--space-3); }
.bullet-list__item { display: flex; align-items: center; gap: var(--space-2); }
.bullet-list__mark { display: flex; align-items: center; justify-content: center; width: 48rpx; height: 48rpx; border-radius: 50%; background: var(--color-bg-soft); color: var(--color-primary-deep); font-size: 22rpx; }
.bullet-list__text { flex: 1; color: var(--color-text-primary); font-size: var(--font-size-body-small); }
.step-list__item { display: flex; gap: var(--space-3); }
.step-list__number { display: flex; flex: 0 0 64rpx; align-items: center; justify-content: center; height: 64rpx; border-radius: 50%; background: var(--color-bg-soft); color: var(--color-primary-deep); font-size: 22rpx; font-weight: var(--font-weight-semibold); }
.step-list__copy { display: flex; flex: 1; flex-direction: column; }
.step-list__title { color: var(--color-text-primary); font-size: var(--font-size-body); font-weight: var(--font-weight-semibold); }
.step-list__body { margin-top: 4rpx; color: var(--color-text-secondary); font-size: var(--font-size-caption); line-height: 1.55; }
.prompt-card { display: flex; align-items: flex-start; gap: var(--space-2); }
.prompt-card__mark { color: var(--color-primary); font-family: serif; font-size: 58rpx; line-height: 0.9; }
.prompt-card__text { flex: 1; color: var(--color-text-primary); font-size: var(--font-size-body-small); line-height: 1.65; }
.safety-card { display: flex; flex-direction: column; gap: var(--space-2); }
.safety-card__title { color: var(--color-primary-deep); font-size: var(--font-size-body); font-weight: var(--font-weight-semibold); }
.safety-card__item { color: var(--color-text-secondary); font-size: var(--font-size-caption); line-height: 1.55; }
</style>
