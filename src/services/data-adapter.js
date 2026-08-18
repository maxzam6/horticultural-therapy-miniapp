import {
  mockAssessmentQuestions,
  mockCourses,
  mockRecords,
  mockUser,
} from '@/mock'
import { getStorage, setStorage, STORAGE_KEYS } from './storage'

const clone = (value) => JSON.parse(JSON.stringify(value))

export const dataMode = import.meta.env.VITE_DATA_MODE || 'mock'

export const dataAdapter = {
  async getCurrentUser() {
    return getStorage(STORAGE_KEYS.user, clone(mockUser))
  },
  async mockLogin() {
    const user = clone(mockUser)
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
