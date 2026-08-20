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
const expandedSection = ref('about')

const user = computed(() => userStore.user)
const nickname = computed(() => user.value?.nickname || '自然体验者')
const ageLabel = computed(() => user.value?.ageRange || '愿意靠近自然')

// C010：成长身份只消费统一汇总，不在页面重新计算等级或 Record 数量。
const growthSummary = computed(() => experienceStore.growthSummary || {
  completedCount: 0,
  exploredSenseCount: 0,
  totalMinutes: 0,
  level: '等待启程',
})

const assessmentResult = computed(() => assessmentStore.result)
const hasAssessment = computed(() => Number.isFinite(Number(assessmentResult.value?.experienceOverviewScore)))
const assessmentDimensions = computed(() => [
  { key: 'emotion', label: '情绪状态' },
  { key: 'stress', label: '压力状态' },
  { key: 'nature', label: '自然连接' },
].map((item) => ({
  ...item,
  value: assessmentResult.value?.[item.key]?.score,
  status: assessmentResult.value?.[item.key]?.label,
})))

async function loadPage() {
  isLoading.value = true
  const requests = [
    userStore.loadCurrentUser(),
    experienceStore.loadRecords(),
  ]

  // B 侧可提供显式加载 Action；若采用 Store getter，则随 records 一起更新。
  if (typeof experienceStore.loadGrowthSummary === 'function') {
    requests.push(experienceStore.loadGrowthSummary())
  }
  if (!assessmentStore.result) requests.push(assessmentStore.loadLatestResult())

  await Promise.allSettled(requests)
  isLoading.value = false
}

function openRecords() {
  goTo(ROUTES.RECORDS)
}

function toggleSection(section) {
  expandedSection.value = expandedSection.value === section ? '' : section
}

onShow(loadPage)
</script>

<template>
  <view class="page-container mine-page">
    <view class="mine-hero">
      <image
        class="mine-hero__image"
        src="/static/illustrations/growth-journey.jpg"
        mode="aspectFill"
      />
      <view class="mine-hero__shade" />
      <view class="mine-hero__copy">
        <text class="mine-hero__eyebrow">我的自然旅程</text>
        <text class="mine-hero__title">你好，{{ nickname }}</text>
        <text class="mine-hero__description">把每一次靠近自然的时刻，慢慢收进自己的旅程。</text>
      </view>
    </view>

    <view class="profile-card-wrap">
      <AppCard padding="compact">
        <view class="profile-card">
          <view class="profile-card__avatar">叶</view>
          <view class="profile-card__content">
            <text class="profile-card__name">{{ nickname }}</text>
            <text class="profile-card__meta">{{ ageLabel }}</text>
          </view>
          <text class="profile-card__tag">自然体验者</text>
        </view>
      </AppCard>
    </view>

    <view class="section-heading">
      <text class="section-heading__eyebrow">成长身份</text>
      <text class="section-heading__title">你正在成为怎样的自然同行者？</text>
    </view>

    <AppCard padding="compact">
      <view class="growth-card">
        <view class="growth-card__headline">
          <view>
            <text class="growth-card__label">当前身份</text>
            <text class="growth-card__level">{{ growthSummary.level }}</text>
          </view>
          <text class="growth-card__leaf">芽</text>
        </view>
        <view class="growth-card__stats">
          <view class="growth-stat">
            <text class="growth-stat__value">{{ growthSummary.completedCount }}</text>
            <text class="growth-stat__label">完成体验</text>
          </view>
          <view class="growth-stat">
            <text class="growth-stat__value">{{ growthSummary.exploredSenseCount }}</text>
            <text class="growth-stat__label">探索感官</text>
          </view>
          <view class="growth-stat">
            <text class="growth-stat__value">{{ growthSummary.totalMinutes }}</text>
            <text class="growth-stat__label">累计分钟</text>
          </view>
        </view>
      </view>
    </AppCard>

    <view class="section-heading">
      <text class="section-heading__eyebrow">最近状态探索</text>
      <text class="section-heading__title">留意此刻的自己</text>
    </view>

    <AppCard padding="compact">
      <view v-if="hasAssessment" class="assessment-card">
        <view class="assessment-card__score-row">
          <text class="assessment-card__score">{{ assessmentResult.experienceOverviewScore }}</text>
          <text class="assessment-card__unit">状态体验概览分</text>
        </view>
        <text class="assessment-card__note">仅用于产品体验反馈，不属于医学诊断或正式量表。</text>
        <view class="assessment-card__dimensions">
          <view v-for="item in assessmentDimensions" :key="item.key" class="assessment-dimension">
            <text class="assessment-dimension__label">{{ item.label }}</text>
            <text class="assessment-dimension__value">
              {{ item.value ?? '—' }}<text v-if="item.status"> · {{ item.status }}</text>
            </text>
          </view>
        </view>
      </view>
      <view v-else class="assessment-empty">
        <text class="assessment-empty__title">还没有最近评估</text>
        <text class="assessment-empty__description">完成一次状态探索后，结果会出现在这里。</text>
      </view>
    </AppCard>

    <view class="records-entry">
      <AppCard interactive padding="compact" @click="openRecords">
        <view class="records-entry__content">
          <view>
            <text class="records-entry__eyebrow">自然旅程</text>
            <text class="records-entry__title">我的记录</text>
            <text class="records-entry__description">回看已经完成的体验与自然印记</text>
          </view>
          <text class="records-entry__arrow">→</text>
        </view>
      </AppCard>
    </view>

    <view class="section-heading section-heading--compact">
      <text class="section-heading__eyebrow">了解更多</text>
      <text class="section-heading__title">关于与隐私</text>
    </view>

    <AppCard padding="none">
      <view class="info-section">
        <view class="info-section__header" @click="toggleSection('about')">
          <text class="info-section__title">关于园艺疗法</text>
          <text class="info-section__toggle">{{ expandedSection === 'about' ? '−' : '+' }}</text>
        </view>
        <text v-if="expandedSection === 'about'" class="info-section__body">
          园艺疗法借助植物、自然环境与园艺活动，帮助人们觉察当下、舒缓情绪并建立与自然的连接。本小程序用于展示一次轻量、可记录的数字化体验流程。
        </text>
      </view>
      <view class="info-section info-section--bordered">
        <view class="info-section__header" @click="toggleSection('privacy')">
          <text class="info-section__title">隐私说明</text>
          <text class="info-section__toggle">{{ expandedSection === 'privacy' ? '−' : '+' }}</text>
        </view>
        <text v-if="expandedSection === 'privacy'" class="info-section__body">
          本展示版本仅使用体验所需的昵称、档案、评估和体验记录。相关内容用于本次展示与答辩，不用于医疗诊断、商业运营或对外公开。
        </text>
      </view>
    </AppCard>

    <view v-if="isLoading" class="sync-note">正在同步你的自然旅程…</view>
    <AppButton variant="secondary" @click="openRecords">去看看我的记录</AppButton>
  </view>
</template>

<style lang="scss" scoped>
.mine-page {
  padding-top: calc(var(--space-3) + env(safe-area-inset-top));
  padding-bottom: calc(var(--space-6) + env(safe-area-inset-bottom));
}

.mine-hero {
  position: relative;
  min-height: 360rpx;
  overflow: hidden;
  border-radius: var(--radius-hero);
  background: var(--color-primary-deep);
}

.mine-hero__image,
.mine-hero__shade {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.mine-hero__shade {
  background: linear-gradient(180deg, rgba(31, 49, 30, 0.08), rgba(31, 49, 30, 0.76));
}

.mine-hero__copy {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  min-height: 320rpx;
  padding: var(--space-4);
  color: #fffdf6;
}

.mine-hero__eyebrow,
.section-heading__eyebrow {
  color: #dcebcf;
  font-size: var(--font-size-caption);
  font-weight: var(--font-weight-semibold);
  letter-spacing: 4rpx;
}

.mine-hero__title {
  margin-top: var(--space-2);
  font-size: 46rpx;
  font-weight: var(--font-weight-bold);
  line-height: 1.3;
}

.mine-hero__description {
  margin-top: var(--space-2);
  color: rgba(255, 253, 246, 0.88);
  font-size: var(--font-size-caption);
  line-height: 1.6;
}

.profile-card-wrap {
  position: relative;
  z-index: 2;
  margin: -36rpx var(--space-3) 0;
}

.profile-card,
.profile-card__content,
.growth-card,
.growth-card__headline,
.records-entry__content {
  display: flex;
}

.profile-card {
  align-items: center;
  gap: var(--space-3);
}

.profile-card__avatar,
.growth-card__leaf {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--color-bg-soft);
  color: var(--color-primary-deep);
  font-weight: var(--font-weight-bold);
}

.profile-card__avatar {
  flex: 0 0 80rpx;
  width: 80rpx;
  height: 80rpx;
  font-size: var(--font-size-body);
}

.profile-card__content {
  flex: 1;
  flex-direction: column;
}

.profile-card__name,
.profile-card__tag,
.growth-card__level,
.records-entry__title,
.info-section__title {
  color: var(--color-text);
  font-weight: var(--font-weight-semibold);
}

.profile-card__name {
  font-size: var(--font-size-card-title);
}

.profile-card__meta {
  margin-top: 4rpx;
  color: var(--color-text-secondary);
  font-size: var(--font-size-caption);
}

.profile-card__tag {
  padding: 8rpx 14rpx;
  border-radius: var(--radius-tag);
  background: var(--color-bg-soft);
  color: var(--color-primary-deep);
  font-size: var(--font-size-label);
}

.section-heading {
  display: flex;
  flex-direction: column;
  padding: var(--space-5) var(--space-1) var(--space-3);
}

.section-heading--compact {
  padding-top: var(--space-4);
}

.section-heading__eyebrow {
  color: var(--color-primary);
}

.section-heading__title {
  margin-top: var(--space-1);
  color: var(--color-text);
  font-size: var(--font-size-section-title);
  font-weight: var(--font-weight-semibold);
  line-height: 1.35;
}

.growth-card {
  flex-direction: column;
}

.growth-card__headline {
  align-items: center;
  justify-content: space-between;
}

.growth-card__label,
.growth-stat__label,
.assessment-card__unit,
.assessment-card__note,
.assessment-dimension__label,
.records-entry__eyebrow,
.info-section__body,
.sync-note {
  color: var(--color-text-secondary);
  font-size: var(--font-size-caption);
}

.growth-card__label,
.records-entry__eyebrow {
  display: block;
}

.growth-card__level {
  display: block;
  margin-top: var(--space-1);
  color: var(--color-primary-deep);
  font-size: var(--font-size-card-title);
}

.growth-card__leaf {
  width: 72rpx;
  height: 72rpx;
  font-size: var(--font-size-body);
}

.growth-card__stats {
  display: flex;
  margin-top: var(--space-4);
  padding-top: var(--space-3);
  border-top: 1rpx solid var(--color-border);
}

.growth-stat {
  display: flex;
  flex: 1;
  flex-direction: column;
}

.growth-stat + .growth-stat {
  padding-left: var(--space-3);
  border-left: 1rpx solid var(--color-border);
}

.growth-stat__value {
  color: var(--color-primary-deep);
  font-size: var(--font-size-section-title);
  font-weight: var(--font-weight-semibold);
}

.growth-stat__label {
  margin-top: 4rpx;
}

.assessment-card,
.assessment-empty {
  display: flex;
  flex-direction: column;
}

.assessment-card__score-row {
  display: flex;
  align-items: baseline;
  gap: var(--space-2);
}

.assessment-card__score {
  color: var(--color-primary-deep);
  font-size: 68rpx;
  font-weight: var(--font-weight-bold);
  line-height: 1;
}

.assessment-card__unit {
  color: var(--color-text-secondary);
}

.assessment-card__note {
  margin-top: var(--space-2);
  line-height: 1.5;
}

.assessment-card__dimensions {
  display: flex;
  gap: var(--space-2);
  margin-top: var(--space-4);
}

.assessment-dimension {
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: var(--space-2);
  border-radius: var(--radius-tag);
  background: var(--color-bg-soft);
}

.assessment-dimension__value {
  margin-top: 4rpx;
  color: var(--color-primary-deep);
  font-size: var(--font-size-caption);
  font-weight: var(--font-weight-semibold);
}

.assessment-empty__title {
  color: var(--color-text);
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-semibold);
}

.assessment-empty__description {
  margin-top: var(--space-1);
  color: var(--color-text-secondary);
  font-size: var(--font-size-caption);
}

.records-entry {
  margin-top: var(--space-4);
}

.records-entry__content {
  align-items: center;
  justify-content: space-between;
}

.records-entry__title {
  display: block;
  margin-top: 4rpx;
  font-size: var(--font-size-card-title);
}

.records-entry__description {
  display: block;
  margin-top: 4rpx;
  color: var(--color-text-secondary);
  font-size: var(--font-size-caption);
}

.records-entry__arrow {
  color: var(--color-primary);
  font-size: 44rpx;
}

.info-section {
  padding: var(--space-4);
}

.info-section--bordered {
  border-top: 1rpx solid var(--color-border);
}

.info-section__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: var(--touch-target-min);
}

.info-section__title {
  font-size: var(--font-size-body);
}

.info-section__toggle {
  color: var(--color-primary);
  font-size: 38rpx;
  font-weight: var(--font-weight-semibold);
}

.info-section__body {
  display: block;
  padding-right: var(--space-4);
  line-height: 1.7;
}

.sync-note {
  margin: var(--space-3) 0;
  text-align: center;
}
</style>
