<script setup>
import { computed, onMounted, ref } from 'vue'
import AppButton from '@/components/AppButton.vue'
import AppCard from '@/components/AppCard.vue'
import AppStateView from '@/components/AppStateView.vue'
import { ROUTES } from '@/config/routes'
import { goTo } from '@/services/navigation'
import { useAssessmentStore } from '@/stores/assessment'

const assessmentStore = useAssessmentStore()
const loading = ref(true)
const error = ref('')
const result = computed(() => assessmentStore.result)

onMounted(async () => {
  try {
    if (!assessmentStore.result) await assessmentStore.loadLatestResult()
  } catch (loadError) {
    error.value = loadError.message || '暂时无法读取最近评估'
  } finally {
    loading.value = false
  }
})

const explore = () => goTo(ROUTES.EXPLORE)
</script>

<template>
  <view class="page-container result-page">
    <text class="result-page__eyebrow">状态报告</text>
    <text class="result-page__title">本次体验状态概览</text>
    <AppStateView v-if="loading" state="loading" title="正在整理你的体验反馈" />
    <AppStateView v-else-if="error" state="error" :description="error" />
    <AppStateView v-else-if="!result" state="empty" title="暂时没有评估记录" description="完成状态探索后，这里会生成你的体验反馈。" />
    <template v-else>
      <AppCard class="result-page__score-card">
        <text class="result-page__score-label">状态体验概览分</text>
        <text class="result-page__score">{{ result.experienceOverviewScore }}</text>
        <text class="result-page__disclaimer">仅用于产品体验反馈，不属于医学诊断，不等同正式量表。</text>
      </AppCard>
      <view class="result-page__dimensions">
        <AppCard v-for="item in [
          { key: 'emotion', label: '情绪状态' },
          { key: 'stress', label: '压力状态' },
          { key: 'nature', label: '自然连接' },
        ]" :key="item.key" class="dimension-card">
          <text class="dimension-card__label">{{ item.label }}</text>
          <text class="dimension-card__score">{{ result[item.key].score }}</text>
          <text class="dimension-card__status">{{ result[item.key].label }}</text>
        </AppCard>
      </view>
      <AppCard class="result-page__recommendation">
        <text class="result-page__recommendation-label">为你推荐</text>
        <text class="result-page__recommendation-title">多肉种植体验</text>
        <text class="result-page__recommendation-text">从触摸土壤和植物开始，慢慢进入五感花园。</text>
      </AppCard>
      <AppButton @click="explore">进入探索</AppButton>
    </template>
  </view>
</template>

<style lang="scss" scoped>
.result-page { display: flex; flex-direction: column; gap: var(--space-5); }
.result-page__eyebrow { color: var(--color-primary-deep); font-size: var(--font-size-caption); font-weight: var(--font-weight-semibold); letter-spacing: 4rpx; }
.result-page__title { color: var(--color-text); font-size: var(--font-size-display); font-weight: var(--font-weight-semibold); line-height: 1.25; }
.result-page__score-card { display: flex; flex-direction: column; align-items: center; padding: var(--space-6); }
.result-page__score-label, .result-page__recommendation-label { color: var(--color-text-secondary); font-size: var(--font-size-caption); }
.result-page__score { margin-top: var(--space-2); color: var(--color-primary-deep); font-size: 96rpx; font-weight: var(--font-weight-semibold); line-height: 1; }
.result-page__disclaimer { margin-top: var(--space-4); color: var(--color-text-muted); font-size: var(--font-size-caption); text-align: center; }
.result-page__dimensions { display: flex; gap: var(--space-3); }
.dimension-card { display: flex; flex: 1; flex-direction: column; padding: var(--space-4); }
.dimension-card__label, .dimension-card__status { color: var(--color-text-secondary); font-size: var(--font-size-caption); }
.dimension-card__score { margin-top: var(--space-2); color: var(--color-primary-deep); font-size: var(--font-size-heading); font-weight: var(--font-weight-semibold); }
.dimension-card__status { margin-top: var(--space-1); }
.result-page__recommendation { display: flex; flex-direction: column; padding: var(--space-5); }
.result-page__recommendation-title { margin-top: var(--space-2); color: var(--color-text); font-size: var(--font-size-heading); font-weight: var(--font-weight-semibold); }
.result-page__recommendation-text { margin-top: var(--space-2); color: var(--color-text-secondary); }
</style>
