import {
  mockAssessmentQuestions,
  mockCourses,
  mockRecords,
  mockUser,
} from '@/mock'
import { getStorage, setStorage, STORAGE_KEYS } from './storage'

const clone = (value) => JSON.parse(JSON.stringify(value))
const realAdapterError = () => new Error('Real Adapter尚未配置')

export const dataMode = import.meta.env.VITE_DATA_MODE || 'mock'

const mockAdapter = {
  async getCurrentUser() {
    return getStorage(STORAGE_KEYS.user, clone(mockUser))
  },
  async mockLogin() {
    const user = getStorage(STORAGE_KEYS.user, null) || clone(mockUser)
    await setStorage(STORAGE_KEYS.user, user)
    return user
  },
  async saveUserProfile(profile) {
    const user = { ...clone(mockUser), ...clone(profile), profileCompleted: true }
    await setStorage(STORAGE_KEYS.user, user)
    return user
  },
  async getAssessmentQuestions() {
    return clone(mockAssessmentQuestions)
  },
  async saveAssessmentSubmission(payload) {
    await setStorage(STORAGE_KEYS.latestAssessment, clone(payload))
    return clone(payload)
  },
  async getLatestAssessment() {
    return getStorage(STORAGE_KEYS.latestAssessment, null)
  },
  async getCourses() {
    return clone(mockCourses)
  },
  async getCourseById(courseId) {
    return clone(mockCourses.find((course) => course.id === courseId) || null)
  },
  async startExperienceSession(courseId) {
    const session = { id: `session-${Date.now()}`, courseId, status: 'active' }
    await setStorage(STORAGE_KEYS.activeSession, session)
    return session
  },
  async completeExperienceSession(sessionId, payload) {
    const record = { ...clone(payload), id: payload.id || `record-${Date.now()}`, sessionId }
    const records = getStorage(STORAGE_KEYS.records, clone(mockRecords))
    await setStorage(STORAGE_KEYS.records, [record, ...records.filter((item) => item.id !== record.id)])
    return record
  },
  async getRecords() {
    return getStorage(STORAGE_KEYS.records, clone(mockRecords))
  },
  async getRecordById(recordId) {
    const records = await this.getRecords()
    return records.find((record) => record.id === recordId) || null
  },
}

const realAdapter = Object.fromEntries([
  'getCurrentUser',
  'mockLogin',
  'saveUserProfile',
  'getAssessmentQuestions',
  'saveAssessmentSubmission',
  'getLatestAssessment',
  'getCourses',
  'getCourseById',
  'startExperienceSession',
  'completeExperienceSession',
  'getRecords',
  'getRecordById',
].map((name) => [name, async () => { throw realAdapterError() }]))

let selectedAdapter = mockAdapter
if (dataMode === 'real') {
  selectedAdapter = realAdapter
} else if (dataMode !== 'mock') {
  if (import.meta.env.DEV) console.warn(`[园艺疗法] 未知 VITE_DATA_MODE: ${dataMode}，开发环境回退 Mock Adapter`)
}

export { mockAdapter, realAdapter }
export const dataAdapter = selectedAdapter
