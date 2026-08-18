export const STORAGE_KEYS = Object.freeze({
  user: 'horticulture:user',
  assessmentDraft: 'horticulture:assessment-draft',
  latestAssessment: 'horticulture:latest-assessment',
  activeSession: 'horticulture:active-session',
  records: 'horticulture:records',
})

const allKeys = Object.values(STORAGE_KEYS)

export function getStorage(key, fallback = null) {
  try {
    const value = uni.getStorageSync(key)
    if (value === '' || value === null || typeof value === 'undefined') return fallback
    return typeof value === 'string' ? JSON.parse(value) : value
  } catch (error) {
    console.warn(`[园艺疗法] storage read failed: ${key}`, error)
    return fallback
  }
}

export function setStorage(key, value) {
  try {
    uni.setStorageSync(key, value)
    return true
  } catch (error) {
    console.warn(`[园艺疗法] storage write failed: ${key}`, error)
    return false
  }
}

export function removeStorage(key) {
  try {
    uni.removeStorageSync(key)
    return true
  } catch (error) {
    console.warn(`[园艺疗法] storage remove failed: ${key}`, error)
    return false
  }
}

export function clearDemoStorage() {
  allKeys.forEach(removeStorage)
}
