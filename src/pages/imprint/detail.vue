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
const recordId = ref('')
const record = ref(null)
const pageState = ref('loading')
const pageError = ref('')

const completedAtText = computed(() => formatDate(record.value?.completedAt))
const imageUrl = computed(() => record.value?.imageUrl || '')

function decodeParam(value) {
  if (!value) return ''
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

function formatDate(value) {
  if (!value) return '刚刚完成'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

async function loadRecord() {
  pageState.value = 'loading'
  pageError.value = ''
  record.value = null
  if (!recordId.value) {
    pageState.value = 'empty'
    return
  }

  try {
    record.value = await experienceStore.loadRecord(recordId.value)
    pageState.value = record.value ? 'ready' : 'empty'
  } catch (error) {
    pageError.value = error?.message || '自然印记暂时没有加载成功，请稍后再试。'
    pageState.value = 'error'
  }
}

onLoad(async (options) => {
  recordId.value = decodeParam(options?.recordId)
  await loadRecord()
})

const viewRecords = () => goTo(ROUTES.RECORDS)
const continueExplore = () => goTo(ROUTES.EXPLORE)
const goBack = () => uni.navigateBack()
</script>

<template>
  <view class="page-container imprint-detail-page">
    <view class="detail-nav">
      <text class="detail-nav__back" @click="goBack">‹</text>
      <text class="detail-nav__title">自然印记</text>
      <view class="detail-nav__spacer" />
    </view>

    <AppStateView v-if="pageState === 'loading'" state="loading" title="正在收好这枚印记" description="请稍等，正在读取你的体验记录。" />
    <AppStateView v-else-if="pageState === 'error'" state="error" :description="pageError" action-label="重新读取" @retry="loadRecord" />
    <AppStateView v-else-if="pageState === 'empty'" state="empty" title="还没有找到这枚印记" description="请从体验任务完成页进入自然印记。" />

    <template v-else-if="record">
      <view class="imprint-hero">
        <image class="imprint-hero__image" src="/static/illustrations/growth-journey.jpg" mode="aspectFill" />
        <view class="imprint-hero__shade" />
        <view class="imprint-hero__copy">
          <text class="imprint-hero__eyebrow">自然印记 · 已保存</text>
          <text class="imprint-hero__title">你和自然一起完成了一次体验</text>
          <text class="imprint-hero__subtitle">每一次认真感受，都值得被温柔地记下来。</text>
        </view>
      </view>

      <AppCard>
        <view class="record-summary">
          <text class="record-summary__eyebrow">{{ record.sense || '自然体验' }}</text>
          <text class="record-summary__title">{{ record.courseTitle || '园艺体验' }}</text>
          <text class="record-summary__date">{{ completedAtText }}</text>
          <view class="record-summary__meta">
            <view class="record-summary__meta-item">
              <text class="record-summary__label">体验时长</text>
              <text class="record-summary__value">{{ record.duration || '—' }}<text v-if="record.duration"> 分钟</text></text>
            </view>
            <view class="record-summary__meta-item">
              <text class="record-summary__label">成长身份</text>
              <text class="record-summary__value">{{ record.growthIdentity || '自然体验者' }}</text>
            </view>
          </view>
        </view>
      </AppCard>

      <AppCard>
        <view class="reflection-card">
          <text class="reflection-card__eyebrow">这一刻的感受</text>
          <view class="reflection-card__mood">
            <text class="reflection-card__label">心情</text>
            <text class="reflection-card__mood-value">{{ record.mood || '已完成体验' }}</text>
          </view>
          <view class="reflection-card__feeling">
            <text class="reflection-card__label">我的感受</text>
            <text class="reflection-card__feeling-value">{{ record.feeling || '我为自己留出了一段与自然相处的时间。' }}</text>
          </view>
        </view>
      </AppCard>

      <AppCard v-if="imageUrl" padding="none">
        <image class="record-image" :src="imageUrl" mode="aspectFill" />
      </AppCard>

      <view class="imprint-note">
        <text class="imprint-note__mark">叶</text>
        <text class="imprint-note__text">这份记录只属于这次体验。你可以回到记录中再次看见它，也可以继续探索下一种自然感受。</text>
      </view>

      <view class="imprint-actions">
        <AppButton @click="viewRecords">查看我的记录</AppButton>
        <AppButton variant="secondary" @click="continueExplore">继续探索</AppButton>
      </view>
    </template>
  </view>
</template>

<style lang="scss" scoped>
.imprint-detail-page { display: flex; flex-direction: column; gap: var(--space-4); padding-top: calc(var(--space-2) + env(safe-area-inset-top)); padding-bottom: calc(var(--space-6) + env(safe-area-inset-bottom)); }
.detail-nav { display: flex; align-items: center; min-height: 72rpx; }
.detail-nav__back { width: 64rpx; color: var(--color-text-primary); font-size: 64rpx; line-height: 0.8; }
.detail-nav__title { flex: 1; color: var(--color-text-primary); font-size: var(--font-size-body); font-weight: var(--font-weight-semibold); text-align: center; }
.detail-nav__spacer { width: 64rpx; }
.imprint-hero { position: relative; min-height: 520rpx; overflow: hidden; border-radius: var(--radius-hero); background: var(--color-primary-deep); box-shadow: var(--shadow-card); }
.imprint-hero__image, .imprint-hero__shade { position: absolute; inset: 0; width: 100%; height: 100%; }
.imprint-hero__shade { background: linear-gradient(180deg, rgba(35, 58, 35, 0.08), rgba(35, 58, 35, 0.8)); }
.imprint-hero__copy { position: relative; display: flex; min-height: 460rpx; justify-content: flex-end; flex-direction: column; padding: var(--space-5); color: #fffdf6; }
.imprint-hero__eyebrow { color: #dcebcf; font-size: var(--font-size-caption); font-weight: var(--font-weight-semibold); letter-spacing: 3rpx; }
.imprint-hero__title { margin-top: var(--space-2); font-size: 48rpx; font-weight: var(--font-weight-bold); line-height: 1.3; }
.imprint-hero__subtitle { margin-top: var(--space-2); color: rgba(255, 253, 246, 0.88); font-size: var(--font-size-caption); line-height: 1.6; }
.record-summary, .reflection-card { display: flex; flex-direction: column; }
.record-summary__eyebrow, .reflection-card__eyebrow { color: var(--color-primary); font-size: var(--font-size-caption); font-weight: var(--font-weight-semibold); letter-spacing: 3rpx; }
.record-summary__title { margin-top: var(--space-2); color: var(--color-text-primary); font-size: var(--font-size-heading); font-weight: var(--font-weight-bold); }
.record-summary__date { margin-top: 6rpx; color: var(--color-text-muted); font-size: var(--font-size-caption); }
.record-summary__meta { display: flex; gap: var(--space-3); margin-top: var(--space-4); padding-top: var(--space-3); border-top: 1rpx solid var(--color-border); }
.record-summary__meta-item { display: flex; flex: 1; flex-direction: column; gap: 4rpx; }
.record-summary__label, .reflection-card__label { color: var(--color-text-muted); font-size: var(--font-size-caption); }
.record-summary__value { color: var(--color-primary-deep); font-size: var(--font-size-body); font-weight: var(--font-weight-semibold); }
.reflection-card__mood, .reflection-card__feeling { display: flex; flex-direction: column; margin-top: var(--space-3); padding: var(--space-3); border-radius: var(--radius-tag); background: var(--color-bg-soft); }
.reflection-card__mood-value { margin-top: var(--space-1); color: var(--color-primary-deep); font-size: var(--font-size-body); font-weight: var(--font-weight-semibold); }
.reflection-card__feeling-value { margin-top: var(--space-1); color: var(--color-text-primary); font-size: var(--font-size-body-small); line-height: 1.65; }
.record-image { display: block; width: 100%; height: 360rpx; border-radius: var(--radius-card); }
.imprint-note { display: flex; align-items: flex-start; gap: var(--space-3); padding: var(--space-3); border-radius: var(--radius-card); background: var(--color-bg-soft); }
.imprint-note__mark { display: flex; align-items: center; justify-content: center; flex: 0 0 56rpx; width: 56rpx; height: 56rpx; border-radius: 50%; background: var(--color-primary); color: var(--color-on-primary); font-size: 22rpx; }
.imprint-note__text { flex: 1; color: var(--color-text-secondary); font-size: var(--font-size-caption); line-height: 1.6; }
.imprint-actions { display: flex; flex-direction: column; gap: var(--space-3); }
</style>
