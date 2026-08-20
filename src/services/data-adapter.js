import {
  mockAssessmentQuestions,
  mockCourses,
  mockRecords,
  mockUser,
} from '@/mock'
import { getStorage, setStorage, STORAGE_KEYS } from './storage'

const clone = (value) => JSON.parse(JSON.stringify(value))
const realAdapterError = () => new Error('Real Adapter尚未配置')
const completionPromises = new Map()

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
    const course = mockCourses.find((item) => item.id === courseId)
    if (!course) throw new Error('体验课程不存在')
    const current = getStorage(STORAGE_KEYS.activeSession, null)
    if (current?.courseId === courseId && current.status === 'active') return clone(current)
    const session = {
      id: `session-${Date.now()}`,
      courseId,
      status: 'active',
      currentStep: 0,
      startedAt: new Date().toISOString(),
      completedAt: null,
      recordId: null,
    }
    await setStorage(STORAGE_KEYS.activeSession, session)
    return clone(session)
  },
  async getExperienceSession(sessionId) {
    const session = getStorage(STORAGE_KEYS.activeSession, null)
    return session?.id === sessionId ? clone(session) : null
  },
  async updateExperienceSession(sessionId, updates) {
    const session = await this.getExperienceSession(sessionId)
    if (!session) throw new Error('体验 Session 不存在或已失效')
    if (session.status === 'completed') return session
    const next = { ...session, currentStep: updates.currentStep ?? session.currentStep }
    await setStorage(STORAGE_KEYS.activeSession, next)
    return clone(next)
  },
  async completeExperienceSession(sessionId, payload) {
    if (completionPromises.has(sessionId)) return clone(await completionPromises.get(sessionId))
    const operation = (async () => {
      const session = await this.getExperienceSession(sessionId)
      if (!session) throw new Error('体验 Session 不存在或已失效')
      const records = getStorage(STORAGE_KEYS.records, clone(mockRecords))
      const existing = records.find((item) => item.sessionId === sessionId)
      if (existing) {
        if (session.status !== 'completed' || session.recordId !== existing.id) {
          await setStorage(STORAGE_KEYS.activeSession, {
            ...session, status: 'completed', completedAt: existing.completedAt, recordId: existing.id,
          })
        }
        return clone(existing)
      }
      if (session.status === 'completed') throw new Error('已完成体验的 Record 无法恢复')
      const course = mockCourses.find((item) => item.id === session.courseId)
      if (!course) throw new Error('体验课程不存在')
      const user = getStorage(STORAGE_KEYS.user, clone(mockUser))
      const completedAt = new Date().toISOString()
      const record = {
        id: `record-${Date.now()}`,
        sessionId,
        userId: user.id,
        courseId: course.id,
        courseTitle: course.title,
        sense: course.sense,
        mood: payload.mood,
        feeling: payload.feeling || '',
        imageUrl: payload.imageUrl || '',
        completedAt,
        duration: course.duration,
        growthIdentity: '自然体验者',
      }
      const nextRecords = [record, ...records]
        .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
      await setStorage(STORAGE_KEYS.records, nextRecords)
      await setStorage(STORAGE_KEYS.activeSession, {
        ...session,
        status: 'completed',
        currentStep: Math.max(session.currentStep, course.steps.length),
        completedAt,
        recordId: record.id,
      })
      return clone(record)
    })()
    completionPromises.set(sessionId, operation)
    try { return clone(await operation) }
    finally { completionPromises.delete(sessionId) }
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
  'getExperienceSession',
  'updateExperienceSession',
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
