<script setup>
import { computed, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import AppButton from '@/components/AppButton.vue'
import AppCard from '@/components/AppCard.vue'
import AppProgress from '@/components/AppProgress.vue'
import { ROUTES } from '@/config/routes'
import { goTo } from '@/services/navigation'
import { dataAdapter } from '@/services/data-adapter'
import { scoreAssessment } from '@/services/assessment-service'
import { useAssessmentStore } from '@/stores/assessment'

const assessmentStore = useAssessmentStore()
const question = computed(() => assessmentStore.questions[assessmentStore.currentIndex])
const progress = computed(() => assessmentStore.questions.length
  ? ((assessmentStore.currentIndex + 1) / assessmentStore.questions.length) * 100 : 0)
const selectedValue = computed(() => question.value && assessmentStore.answers[question.value.code])
const isLastQuestion = computed(() => assessmentStore.currentIndex === assessmentStore.questions.length - 1)
const isSubmitting = computed(() => assessmentStore.submissionStatus === 'submitting')
const hasCompletedResult = computed(() => (
  assessmentStore.submissionStatus === 'succeeded' && Boolean(assessmentStore.result)
))

async function load() {
  if (!assessmentStore.questions.length) await assessmentStore.loadQuestions()
}

onMounted(load)
onShow(load)

function choose(value) {
  if (isSubmitting.value || hasCompletedResult.value) return
  assessmentStore.setAnswer(question.value.code, value)
}

function previous() {
  assessmentStore.goPrevious()
}

async function next() {
  if (isLastQuestion.value && hasCompletedResult.value) {
    goTo(ROUTES.ASSESSMENT_RESULT)
    return
  }
  if (!selectedValue.value) {
    uni.showToast({ title: '请先选择一个答案', icon: 'none' })
    return
  }
  if (!isLastQuestion.value) {
    assessmentStore.goNext()
    return
  }
  if (isSubmitting.value) return
  assessmentStore.submissionStatus = 'submitting'
  assessmentStore.error = null
  try {
    const result = scoreAssessment(assessmentStore.questions, assessmentStore.answers)
    await dataAdapter.saveAssessmentSubmission(result)
    assessmentStore.setResult(result)
    goTo(ROUTES.ASSESSMENT_RESULT)
  } catch (error) {
    assessmentStore.error = error
    assessmentStore.submissionStatus = 'failed'
    uni.showToast({ title: error.message || '提交失败，请重试', icon: 'none' })
  }
}
</script>

<template>
  <view class="page-container assessment-page">
    <text class="assessment-page__eyebrow">状态探索</text>
    <text class="assessment-page__title">了解此刻的自己</text>
    <view class="assessment-page__progress">
      <AppProgress :value="progress" :label="`第 ${assessmentStore.currentIndex + 1} / ${assessmentStore.questions.length} 题`" />
    </view>

    <AppCard v-if="question" class="question-card">
      <text class="question-card__number">问题 {{ assessmentStore.currentIndex + 1 }}</text>
      <text class="question-card__text">{{ question.text }}</text>
      <view class="question-card__options">
        <view
          v-for="option in question.options"
          :key="option.value"
          class="question-option"
          :class="{ 'question-option--selected': selectedValue === option.value }"
          @click="choose(option.value)"
        >
          <text>{{ option.label }}</text>
        </view>
      </view>
    </AppCard>

    <view class="assessment-page__actions">
      <AppButton v-if="assessmentStore.currentIndex > 0" variant="secondary" @click="previous">上一题</AppButton>
      <AppButton :loading="isSubmitting" :disabled="!selectedValue && !hasCompletedResult" @click="next">
        {{ isLastQuestion && hasCompletedResult ? '查看状态报告' : isLastQuestion ? '提交并查看报告' : '下一题' }}
      </AppButton>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.assessment-page { display: flex; flex-direction: column; }
.assessment-page__eyebrow { color: var(--color-primary-deep); font-size: var(--font-size-caption); font-weight: var(--font-weight-semibold); letter-spacing: 4rpx; }
.assessment-page__title { margin-top: var(--space-2); color: var(--color-text); font-size: var(--font-size-display); font-weight: var(--font-weight-semibold); line-height: 1.25; }
.assessment-page__progress { margin-top: var(--space-6); }
.question-card { display: flex; flex-direction: column; margin-top: var(--space-6); padding: var(--space-6); }
.question-card__number { color: var(--color-primary-deep); font-size: var(--font-size-caption); }
.question-card__text { margin-top: var(--space-4); color: var(--color-text); font-size: var(--font-size-heading); font-weight: var(--font-weight-semibold); line-height: 1.45; }
.question-card__options { display: flex; flex-direction: column; gap: var(--space-3); margin-top: var(--space-6); }
.question-option { padding: var(--space-4); border: 1rpx solid var(--color-border); border-radius: var(--radius-card); color: var(--color-text-secondary); background: var(--color-surface); }
.question-option--selected { border-color: var(--color-primary); color: var(--color-primary-deep); background: var(--color-bg-soft); }
.assessment-page__actions { display: flex; gap: var(--space-3); margin-top: var(--space-6); }
.assessment-page__actions .app-button { flex: 1; }
</style>
