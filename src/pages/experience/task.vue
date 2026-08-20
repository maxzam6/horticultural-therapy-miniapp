<script setup>
import { computed, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import AppButton from '@/components/AppButton.vue'
import AppCard from '@/components/AppCard.vue'
import AppProgress from '@/components/AppProgress.vue'
import AppStateView from '@/components/AppStateView.vue'
import { ROUTES } from '@/config/routes'
import { goTo } from '@/services/navigation'
import { useExperienceStore } from '@/stores/experience'

const moods = ['平静', '放松', '专注', '愉悦', '满足']
const experienceStore = useExperienceStore()
const pageState = ref('loading')
const pageError = ref('')
const sessionId = ref('')
const mood = ref('')
const feeling = ref('')
const feedbackMode = ref(false)

const session = computed(() => experienceStore.activeSession)
const course = computed(() => experienceStore.activeCourse)
const steps = computed(() => course.value?.steps || [])
const currentIndex = computed(() => Math.min(session.value?.currentStep || 0, Math.max(steps.value.length - 1, 0)))
const currentStep = computed(() => steps.value[currentIndex.value])
const progress = computed(() => steps.value.length
  ? ((feedbackMode.value ? steps.value.length : currentIndex.value + 1) / steps.value.length) * 100
  : 0)
const isCompleted = computed(() => session.value?.status === 'completed' && Boolean(session.value.recordId))
const canComplete = computed(() => Boolean(mood.value) && !experienceStore.loading)

async function loadTask() {
  pageState.value = 'loading'
  pageError.value = ''
  try {
    await experienceStore.loadSession(sessionId.value)
    if (!steps.value.length) throw new Error('该课程的体验步骤尚未准备好')
    feedbackMode.value = isCompleted.value || session.value.currentStep >= steps.value.length
    if (isCompleted.value) {
      const record = await experienceStore.loadRecord(session.value.recordId)
      if (!record) throw new Error('体验 Record 不存在或已失效')
      mood.value = record.mood
      feeling.value = record.feeling
    }
    pageState.value = 'ready'
  } catch (error) {
    pageError.value = error.message || '体验任务暂时无法加载'
    pageState.value = 'error'
  }
}

onLoad((options) => {
  sessionId.value = options?.sessionId ? decodeURIComponent(options.sessionId) : ''
  if (!sessionId.value) {
    pageError.value = '缺少体验 Session，请返回课程详情重新开始。'
    pageState.value = 'error'
    return
  }
  loadTask()
})

async function previous() {
  if (feedbackMode.value) {
    feedbackMode.value = false
    return
  }
  if (currentIndex.value > 0) await experienceStore.setCurrentStep(currentIndex.value - 1)
}

async function next() {
  if (currentIndex.value < steps.value.length - 1) {
    await experienceStore.setCurrentStep(currentIndex.value + 1)
    return
  }
  await experienceStore.setCurrentStep(steps.value.length)
  feedbackMode.value = true
}

async function complete() {
  if (experienceStore.loading) return
  if (isCompleted.value) {
    goTo(`${ROUTES.IMPRINT_DETAIL}?recordId=${encodeURIComponent(session.value.recordId)}`)
    return
  }
  if (!mood.value) {
    uni.showToast({ title: '请选择此刻的心情', icon: 'none' })
    return
  }
  try {
    const record = await experienceStore.completeSession({ mood: mood.value, feeling: feeling.value, imageUrl: '' })
    goTo(`${ROUTES.IMPRINT_DETAIL}?recordId=${encodeURIComponent(record.id)}`)
  } catch (error) {
    uni.showToast({ title: error.message || '完成失败，请重试', icon: 'none' })
  }
}
</script>

<template>
  <view class="page-container task-page">
    <AppStateView v-if="pageState === 'loading'" state="loading" title="正在准备体验" />
    <AppStateView
      v-else-if="pageState === 'error'"
      state="error"
      :description="pageError"
      action-label="重新加载"
      @retry="loadTask"
    />

    <template v-else>
      <text class="task-page__eyebrow">{{ course.senseName }}体验</text>
      <text class="task-page__title">{{ course.title }}</text>
      <AppProgress
        :value="progress"
        :label="feedbackMode ? '步骤完成 · 留下感受' : `第 ${currentIndex + 1} / ${steps.length} 步`"
      />

      <template v-if="!feedbackMode">
        <AppCard class="step-card">
          <view v-if="currentStep.image" class="step-card__image-wrap">
            <image class="step-card__image" :src="currentStep.image" mode="aspectFill" />
          </view>
          <view v-else class="step-card__placeholder"><text>自然体验步骤</text></view>
          <text class="step-card__number">步骤 {{ currentIndex + 1 }}</text>
          <text class="step-card__title">{{ currentStep.title }}</text>
          <text class="step-card__description">{{ currentStep.description }}</text>
        </AppCard>

        <view class="mindfulness-note">
          <text class="mindfulness-note__label">此刻提示</text>
          <text class="mindfulness-note__text">{{ course.mindfulnessPrompt }}</text>
        </view>

        <view class="task-page__actions">
          <AppButton v-if="currentIndex > 0" variant="secondary" @click="previous">上一步</AppButton>
          <AppButton @click="next">{{ currentIndex === steps.length - 1 ? '完成步骤' : '下一步' }}</AppButton>
        </view>
      </template>

      <template v-else>
        <AppCard class="feedback-card">
          <text class="feedback-card__title">完成这一刻，你感觉如何？</text>
          <text class="feedback-card__label">选择心情</text>
          <view class="mood-list">
            <view
              v-for="item in moods"
              :key="item"
              class="mood-option"
              :class="{ 'mood-option--selected': mood === item }"
              @click="!isCompleted && (mood = item)"
            >{{ item }}</view>
          </view>
          <text class="feedback-card__label">我的感受（选填）</text>
          <textarea
            v-model="feeling"
            class="feedback-card__textarea"
            :disabled="isCompleted"
            maxlength="200"
            placeholder="写下此刻想记住的感受"
          />
          <text class="feedback-card__hint">图片为可选项，本阶段暂不提供真实上传。</text>
        </AppCard>

        <view class="task-page__actions">
          <AppButton v-if="!isCompleted" variant="secondary" @click="previous">返回步骤</AppButton>
          <AppButton :loading="experienceStore.loading" :disabled="!canComplete && !isCompleted" @click="complete">
            {{ isCompleted ? '查看自然印记' : '完成体验' }}
          </AppButton>
        </view>
      </template>
    </template>
  </view>
</template>

<style lang="scss" scoped>
.task-page { display: flex; flex-direction: column; padding-bottom: calc(var(--space-6) + env(safe-area-inset-bottom)); }
.task-page__eyebrow { color: var(--color-primary); font-size: var(--font-size-caption); font-weight: var(--font-weight-semibold); letter-spacing: 4rpx; }
.task-page__title { margin: var(--space-2) 0 var(--space-5); color: var(--color-text); font-size: var(--font-size-page-title); font-weight: var(--font-weight-semibold); }
.step-card, .feedback-card { display: flex; flex-direction: column; margin-top: var(--space-5); padding: var(--space-4); }
.step-card__placeholder { display: flex; align-items: center; justify-content: center; height: 260rpx; border-radius: var(--radius-card); color: var(--color-primary-deep); background: linear-gradient(135deg, #e4eddd, #f4ead9); }
.step-card__image { width: 100%; height: 260rpx; border-radius: var(--radius-card); }
.step-card__number, .feedback-card__label { margin-top: var(--space-4); color: var(--color-primary); font-size: var(--font-size-caption); }
.step-card__title, .feedback-card__title { margin-top: var(--space-2); color: var(--color-text); font-size: var(--font-size-section-title); font-weight: var(--font-weight-semibold); }
.step-card__description { margin-top: var(--space-3); color: var(--color-text-secondary); line-height: var(--line-height-body); }
.mindfulness-note { display: flex; flex-direction: column; margin-top: var(--space-4); padding: var(--space-3); border-radius: var(--radius-card); background: var(--color-bg-soft); }
.mindfulness-note__label { color: var(--color-primary-deep); font-weight: var(--font-weight-semibold); }
.mindfulness-note__text { margin-top: var(--space-1); color: var(--color-text-secondary); line-height: var(--line-height-body); }
.mood-list { display: flex; flex-wrap: wrap; gap: var(--space-2); margin-top: var(--space-3); }
.mood-option { padding: var(--space-2) var(--space-3); border: 1rpx solid var(--color-border); border-radius: var(--radius-tag); color: var(--color-text-secondary); }
.mood-option--selected { border-color: var(--color-primary); color: var(--color-primary-deep); background: var(--color-bg-soft); }
.feedback-card__textarea { box-sizing: border-box; width: 100%; min-height: 180rpx; margin-top: var(--space-2); padding: var(--space-3); border: 1rpx solid var(--color-border); border-radius: var(--radius-card); background: var(--color-bg); }
.feedback-card__hint { margin-top: var(--space-2); color: var(--color-text-muted); font-size: var(--font-size-caption); }
.task-page__actions { display: flex; gap: var(--space-3); margin-top: var(--space-5); }
.task-page__actions .app-button { flex: 1; }
</style>
