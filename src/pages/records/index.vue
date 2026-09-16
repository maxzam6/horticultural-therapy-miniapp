<script setup>
import { computed, ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import AppButton from '@/components/AppButton.vue'
import AppStateView from '@/components/AppStateView.vue'
import { ROUTES } from '@/config/routes'
import { goTo } from '@/services/navigation'
import { useExperienceStore } from '@/stores/experience'
import { useCommunityStore } from '@/stores/community'
import CommunityIdentity from '@/components/CommunityIdentity.vue'
import RecordShare from '@/components/RecordShare.vue'

const senseNames = { visual: '视觉', touch: '触觉', smell: '嗅觉', taste: '味觉', hearing: '听觉' }
const experienceStore = useExperienceStore()
const pageState = ref('loading')
const pageError = ref('')
const records = computed(() => experienceStore.records)
const summary = computed(() => experienceStore.growthSummary)
const community = useCommunityStore()
const journalError = ref('')
const filter = ref('all')
const mixed = computed(() => [
  ...(filter.value === 'journal' ? [] : records.value.map(r => ({...r, kind:'experience',date:r.completedAt}))),
  ...(filter.value === 'experience' ? [] : community.journals.map(r => ({...r, kind:'journal',date:r.createdAt}))),
].sort((a,b)=>new Date(b.date)-new Date(a.date)))
async function loadJournals(more=false){journalError.value='';try{await community.loadJournals(more)}catch(e){journalError.value=e.message}}
const newJournal=()=>goTo(ROUTES.JOURNAL_EDIT)
const openJournal=id=>goTo(`${ROUTES.JOURNAL_DETAIL}?journalId=${encodeURIComponent(id)}`)

function formatDate(value) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '时间待记录'
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
}

async function load() {
  pageState.value = 'loading'
  pageError.value = ''
  try {
    await experienceStore.loadRecords()
    pageState.value = records.value.length ? 'ready' : 'empty'
  } catch (error) {
    pageError.value = error.message || '自然记录暂时没有加载成功，请稍后再试。'
    pageState.value = 'error'
  }
}

onShow(load)
onShow(()=>loadJournals())

const openRecord = (recordId) => goTo(
  `${ROUTES.IMPRINT_DETAIL}?recordId=${encodeURIComponent(recordId)}`,
)
const explore = () => goTo(ROUTES.EXPLORE)
const openMine = () => goTo(ROUTES.MINE)
</script>

<template>
  <view class="page-container records-page">
    <view class="records-hero">
      <text class="records-hero__eyebrow">自然记录</text>
      <text class="records-hero__title">我的自然旅程</text>
      <AppButton variant="secondary" @click="newJournal">＋ 写自然日记</AppButton>
      <text class="records-hero__description">每一次认真感受，都在这里长成一枚自然印记。</text>
    </view>

    <view class="summary-grid">
      <view class="summary-card">
        <text class="summary-card__value">{{ summary.completedCount }}</text>
        <text class="summary-card__label">累计体验</text>
      </view>
      <view class="summary-card">
        <text class="summary-card__value">{{ summary.exploredSenseCount }}</text>
        <text class="summary-card__label">探索感官</text>
      </view>
      <view class="summary-card">
        <text class="summary-card__value">{{ summary.totalMinutes }}</text>
        <text class="summary-card__label">累计分钟</text>
      </view>
    </view>

    <view class="growth-banner">
      <text class="growth-banner__label">当前成长身份</text>
      <text class="growth-banner__level">{{ summary.level }}</text>
    </view>

    <AppStateView v-if="pageState === 'loading'" state="loading" title="正在整理自然印记" />
    <AppStateView
      v-else-if="pageState === 'error'"
      state="error"
      :description="pageError"
      action-label="重新加载"
      @retry="load"
    />
    <view v-else-if="pageState === 'empty'" class="empty-section">
      <AppStateView
        state="empty"
        title="旅程正等待第一片新叶"
        description="完成一次自然体验后，你的第一枚印记会出现在这里。"
      />
      <AppButton @click="explore">去探索</AppButton>
    </view>

    <template v-if="pageState !== 'loading'">
      <CommunityIdentity @ready="loadJournals()" />
      <view class="filters"><button @click="filter='all'">全部</button><button @click="filter='experience'">体验</button><button @click="filter='journal'">日常</button></view>
      <view v-if="journalError"><text>{{journalError}}</text><button @click="loadJournals()">重试日记</button></view>
      <view class="section-heading">
        <text class="section-heading__title">历史印记</text>
        <text class="section-heading__count">{{ records.length }} 次体验</text>
      </view>
      <view class="record-list">
        <view
          v-for="record in mixed"
          :key="record.id"
          class="record-card"
          @click="record.kind==='journal'?openJournal(record.id):openRecord(record.id)"
        >
          <view class="record-card__topline">
            <text class="record-card__sense">{{ record.kind==='journal'?'自然日记':(senseNames[record.sense] || record.sense || '自然')+'体验' }}</text>
            <text class="record-card__date">{{ formatDate(record.date) }}</text>
          </view>
          <image v-if="record.kind==='journal'&&community.images[record.assetIds[0]]" :src="community.images[record.assetIds[0]]" mode="aspectFill" class="journal-cover" />
          <text class="record-card__title">{{ record.courseTitle || record.title }}</text>
          <view v-if="record.kind==='experience'" class="record-card__meta">
            <text>心情 · {{ record.mood || '未记录' }}</text>
            <text>{{ Number(record.duration) || 0 }} 分钟</text>
          </view>
          <text class="record-card__action">查看记录 →</text>
          <view v-if="record.kind==='experience'" @click.stop><RecordShare :record="record" /></view>
          <text v-else class="record-card__action">查看日记，可选择同步上传社区</text>
        </view>
      </view>
      <button v-if="community.journalCursor" @click="loadJournals(true)">加载更多日记</button>
    </template>

    <view class="mine-entry">
      <view>
        <text class="mine-entry__title">看看我的成长</text>
        <text class="mine-entry__description">查看个人档案与最近一次状态探索。</text>
      </view>
      <AppButton variant="secondary" @click="openMine">进入我的</AppButton>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.filters{display:flex;gap:12rpx;margin:24rpx 0}.filters button{flex:1;font-size:26rpx;color:#506a45;background:#fffdf8}.journal-cover{width:100%;height:240rpx;border-radius:20rpx;margin-top:18rpx}
.records-page { padding-top: calc(var(--space-4) + env(safe-area-inset-top)); padding-bottom: calc(150rpx + env(safe-area-inset-bottom)); }
.records-hero { display: flex; flex-direction: column; padding: var(--space-3) var(--space-1) var(--space-5); }
.records-hero__eyebrow { color: var(--color-primary); font-size: var(--font-size-caption); font-weight: var(--font-weight-semibold); letter-spacing: 4rpx; }
.records-hero__title { margin-top: var(--space-2); color: var(--color-text); font-size: var(--font-size-hero); font-weight: var(--font-weight-semibold); }
.records-hero__description { margin-top: var(--space-2); color: var(--color-text-secondary); line-height: var(--line-height-body); }
.summary-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-2); }
.summary-card { display: flex; align-items: center; flex-direction: column; padding: var(--space-3) var(--space-1); border: 1rpx solid var(--color-border); border-radius: var(--radius-card); background: var(--color-surface); box-shadow: var(--shadow-card); }
.summary-card__value { color: var(--color-primary-deep); font-size: 42rpx; font-weight: var(--font-weight-semibold); }
.summary-card__label { margin-top: var(--space-1); color: var(--color-text-muted); font-size: var(--font-size-label); }
.growth-banner { display: flex; align-items: center; justify-content: space-between; margin-top: var(--space-3); padding: var(--space-3) var(--space-4); border-radius: var(--radius-card); background: linear-gradient(135deg, #dfead7, #f3ead8); }
.growth-banner__label { color: var(--color-text-secondary); font-size: var(--font-size-caption); }
.growth-banner__level { color: var(--color-primary-deep); font-weight: var(--font-weight-semibold); }
.section-heading { display: flex; align-items: center; justify-content: space-between; margin: var(--space-6) var(--space-1) var(--space-3); }
.section-heading__title { color: var(--color-text); font-size: var(--font-size-section-title); font-weight: var(--font-weight-semibold); }
.section-heading__count { color: var(--color-text-muted); font-size: var(--font-size-caption); }
.record-list { display: flex; flex-direction: column; gap: var(--space-3); }
.record-card { display: flex; flex-direction: column; padding: var(--space-4); border: 1rpx solid var(--color-border); border-radius: var(--radius-card); background: var(--color-surface); box-shadow: var(--shadow-card); }
.record-card:active { opacity: 0.96; transform: scale(0.99); }
.record-card__topline, .record-card__meta { display: flex; justify-content: space-between; }
.record-card__sense { color: var(--color-primary); font-size: var(--font-size-caption); font-weight: var(--font-weight-semibold); }
.record-card__date, .record-card__meta { color: var(--color-text-muted); font-size: var(--font-size-caption); }
.record-card__title { margin-top: var(--space-3); color: var(--color-text); font-size: var(--font-size-card-title); font-weight: var(--font-weight-semibold); }
.record-card__meta { margin-top: var(--space-3); }
.record-card__action { margin-top: var(--space-3); color: var(--color-primary-deep); font-size: var(--font-size-caption); font-weight: var(--font-weight-semibold); }
.empty-section { margin-top: var(--space-5); }
.mine-entry { display: flex; align-items: center; justify-content: space-between; gap: var(--space-3); margin-top: var(--space-6); padding: var(--space-4); border-radius: var(--radius-card); background: var(--color-bg-soft); }
.mine-entry__title, .mine-entry__description { display: block; }
.mine-entry__title { color: var(--color-text); font-weight: var(--font-weight-semibold); }
.mine-entry__description { margin-top: var(--space-1); color: var(--color-text-secondary); font-size: var(--font-size-caption); }
.mine-entry .app-button { width: 190rpx; }
</style>
