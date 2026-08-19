<script setup>
import { computed, reactive, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import AppButton from '@/components/AppButton.vue'
import AppCard from '@/components/AppCard.vue'
import { ROUTES } from '@/config/routes'
import { goTo } from '@/services/navigation'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const isLoading = ref(true)
const isSaving = ref(false)
const submitted = ref(false)
const pageError = ref('')

const form = reactive({
  nickname: '',
  ageRange: '',
  gardenExperience: '',
  goals: [],
})

const ageOptions = [
  { value: '12-15', label: '12–15 岁' },
  { value: '16-18', label: '16–18 岁' },
  { value: '19-22', label: '19–22 岁' },
  { value: '23+', label: '23 岁及以上' },
]

const experienceOptions = [
  { value: 'beginner', label: '初次接触', description: '还没有园艺实践经验' },
  { value: 'occasional', label: '偶尔尝试', description: '种过植物或参加过活动' },
  { value: 'frequent', label: '经常参与', description: '日常会照料或观察植物' },
]

const goalOptions = [
  { value: 'relax', label: '放松心情' },
  { value: 'nature', label: '亲近自然' },
  { value: 'learn', label: '了解植物' },
  { value: 'hobby', label: '培养兴趣' },
]

const nicknameValid = computed(() => {
  const length = form.nickname.trim().length
  return length >= 1 && length <= 20
})

const formValid = computed(() => (
  nicknameValid.value
  && Boolean(form.ageRange)
  && Boolean(form.gardenExperience)
  && form.goals.length > 0
))

function restoreForm(user) {
  form.nickname = user?.nickname || ''
  form.ageRange = user?.ageRange || ''
  form.gardenExperience = user?.gardenExperience || ''
  form.goals = Array.isArray(user?.goals) ? [...user.goals] : []
}

function toggleGoal(value) {
  const index = form.goals.indexOf(value)
  if (index >= 0) form.goals.splice(index, 1)
  else form.goals.push(value)
}

async function saveProfile() {
  if (isSaving.value) return
  submitted.value = true
  pageError.value = ''
  if (!formValid.value) return

  isSaving.value = true
  try {
    await userStore.saveProfile({
      nickname: form.nickname.trim(),
      ageRange: form.ageRange,
      gardenExperience: form.gardenExperience,
      goals: [...form.goals],
    })
    goTo(ROUTES.ASSESSMENT_INTRO)
  } catch {
    pageError.value = '自然档案暂时保存失败，请稍后重试。'
  } finally {
    isSaving.value = false
  }
}

onLoad(async () => {
  pageError.value = ''
  try {
    if (!userStore.user) await userStore.loadCurrentUser()
    restoreForm(userStore.user)
  } catch {
    pageError.value = '自然档案加载失败，你仍可以填写后继续。'
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <view class="page-container profile-page">
    <view class="profile-header">
      <image
        class="profile-header__image"
        src="/static/illustrations/growth-journey.jpg"
        mode="aspectFill"
      />
      <view class="profile-header__copy">
        <text class="profile-header__eyebrow">自然旅程 · 第二步</text>
        <text class="profile-header__title">建立自然档案</text>
        <text class="profile-header__description">让接下来的体验更贴近你的兴趣与节奏。</text>
      </view>
    </view>

    <view v-if="isLoading" class="loading-panel">
      <text>正在唤醒你的自然档案…</text>
    </view>

    <view v-else class="form-content">
      <view class="field-group">
        <text class="field-group__label">怎么称呼你？</text>
        <text class="field-group__hint">1–20 个字符</text>
        <input
          v-model="form.nickname"
          class="nickname-input"
          maxlength="20"
          placeholder="例如：自然体验者"
          placeholder-class="nickname-input__placeholder"
        />
        <text v-if="submitted && !nicknameValid" class="field-error">请填写 1–20 个字符的昵称</text>
      </view>

      <view class="field-group">
        <text class="field-group__label">你的年龄段</text>
        <view class="chip-list chip-list--two-column">
          <view
            v-for="option in ageOptions"
            :key="option.value"
            class="select-chip"
            :class="{ 'select-chip--active': form.ageRange === option.value }"
            @click="form.ageRange = option.value"
          >
            {{ option.label }}
          </view>
        </view>
        <text v-if="submitted && !form.ageRange" class="field-error">请选择年龄段</text>
      </view>

      <view class="field-group">
        <text class="field-group__label">你与园艺的熟悉程度</text>
        <view class="option-list">
          <AppCard
            v-for="option in experienceOptions"
            :key="option.value"
            interactive
            padding="compact"
            :class="{ 'option-card--active': form.gardenExperience === option.value }"
            @click="form.gardenExperience = option.value"
          >
            <view class="option-card__content">
              <view>
                <text class="option-card__title">{{ option.label }}</text>
                <text class="option-card__description">{{ option.description }}</text>
              </view>
              <text class="option-card__mark">
                {{ form.gardenExperience === option.value ? '✓' : '○' }}
              </text>
            </view>
          </AppCard>
        </view>
        <text v-if="submitted && !form.gardenExperience" class="field-error">请选择园艺经验</text>
      </view>

      <view class="field-group">
        <text class="field-group__label">你希望从体验中获得什么？</text>
        <text class="field-group__hint">可多选，至少选择一项</text>
        <view class="chip-list">
          <view
            v-for="option in goalOptions"
            :key="option.value"
            class="select-chip"
            :class="{ 'select-chip--active': form.goals.includes(option.value) }"
            @click="toggleGoal(option.value)"
          >
            {{ option.label }}
          </view>
        </view>
        <text v-if="submitted && form.goals.length === 0" class="field-error">请至少选择一个体验目标</text>
      </view>

      <text v-if="pageError" class="page-error">{{ pageError }}</text>

      <AppButton :loading="isSaving" :disabled="isSaving" @click="saveProfile">
        {{ isSaving ? '正在保存…' : '保存档案，探索此刻状态' }}
      </AppButton>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.profile-page {
  padding-top: calc(var(--space-3) + env(safe-area-inset-top));
  padding-bottom: calc(var(--space-6) + env(safe-area-inset-bottom));
}

.profile-header {
  position: relative;
  min-height: 330rpx;
  overflow: hidden;
  border-radius: 36rpx;
  background: var(--color-bg-soft);
}

.profile-header__image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0.55;
}

.profile-header__copy {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 260rpx;
  justify-content: flex-end;
  padding: var(--space-4);
  background: linear-gradient(90deg, rgba(248, 245, 234, 0.98), rgba(248, 245, 234, 0.3));
}

.profile-header__eyebrow {
  margin-bottom: var(--space-2);
  color: var(--color-primary);
  font-size: var(--font-size-caption);
  font-weight: var(--font-weight-semibold);
  letter-spacing: 4rpx;
}

.profile-header__title {
  color: var(--color-text-primary);
  font-size: 44rpx;
  font-weight: var(--font-weight-bold);
}

.profile-header__description {
  margin-top: var(--space-2);
  color: var(--color-text-secondary);
  font-size: var(--font-size-caption);
}

.loading-panel {
  padding: 100rpx 0;
  color: var(--color-text-secondary);
  text-align: center;
}

.form-content {
  padding-top: var(--space-5);
}

.field-group {
  margin-bottom: var(--space-5);
}

.field-group__label,
.field-group__hint,
.field-error,
.page-error {
  display: block;
}

.field-group__label {
  color: var(--color-text-primary);
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-semibold);
}

.field-group__hint {
  margin-top: 4rpx;
  color: var(--color-text-secondary);
  font-size: var(--font-size-caption);
}

.nickname-input {
  box-sizing: border-box;
  width: 100%;
  height: var(--control-height);
  margin-top: var(--space-2);
  padding: 0 var(--space-3);
  border: 1rpx solid var(--color-border);
  border-radius: var(--radius-button);
  background: var(--color-surface);
  color: var(--color-text-primary);
  font-size: var(--font-size-body);
}

.nickname-input__placeholder {
  color: var(--color-text-placeholder);
}

.chip-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-top: var(--space-2);
}

.chip-list--two-column .select-chip {
  box-sizing: border-box;
  width: calc(50% - var(--space-1));
  text-align: center;
}

.select-chip {
  padding: var(--space-2) var(--space-3);
  border: 1rpx solid var(--color-border);
  border-radius: var(--radius-tag);
  background: var(--color-surface);
  color: var(--color-text-secondary);
  font-size: var(--font-size-caption);
}

.select-chip--active {
  border-color: var(--color-primary);
  background: var(--color-bg-soft);
  color: var(--color-primary-deep);
  font-weight: var(--font-weight-semibold);
}

.option-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  margin-top: var(--space-2);
}

.option-card--active {
  outline: 2rpx solid var(--color-primary);
}

.option-card__content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.option-card__content > view {
  display: flex;
  flex-direction: column;
}

.option-card__title {
  color: var(--color-text-primary);
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-semibold);
}

.option-card__description {
  margin-top: 4rpx;
  color: var(--color-text-secondary);
  font-size: var(--font-size-caption);
}

.option-card__mark {
  color: var(--color-primary);
  font-size: 38rpx;
}

.field-error,
.page-error {
  margin-top: var(--space-2);
  color: var(--color-error);
  font-size: var(--font-size-caption);
}

.page-error {
  margin-bottom: var(--space-3);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-tag);
  background: #fff0ea;
}
</style>
