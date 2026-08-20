import { defineStore } from 'pinia'
import { mockCourses, mockRecords } from '@/mock'
import { dataAdapter } from '@/services/data-adapter'

export const useExperienceStore = defineStore('experience', {
  state: () => ({
    courses: mockCourses,
    records: mockRecords,
    activeSession: null,
    activeCourse: null,
    activeRecord: null,
    activeCourseId: null,
    loading: false,
    error: null,
  }),
  actions: {
    async loadCourses() { this.courses = await dataAdapter.getCourses(); return this.courses },
    async loadCourse(courseId) {
      this.activeCourse = await dataAdapter.getCourseById(courseId)
      if (!this.activeCourse) throw new Error('体验课程不存在')
      this.activeCourseId = courseId
      return this.activeCourse
    },
    selectCourse(courseId) { this.activeCourseId = courseId },
    setActiveSession(session) { this.activeSession = session },
    async startSession(courseId) {
      if (this.loading) return this.activeSession
      this.loading = true
      this.error = null
      try {
        this.activeSession = await dataAdapter.startExperienceSession(courseId)
        this.activeCourseId = this.activeSession.courseId
        return this.activeSession
      } catch (error) {
        this.error = error
        throw error
      } finally { this.loading = false }
    },
    async loadSession(sessionId) {
      this.loading = true
      this.error = null
      try {
        const session = await dataAdapter.getExperienceSession(sessionId)
        if (!session) throw new Error('体验 Session 不存在或已失效')
        this.activeSession = session
        await this.loadCourse(session.courseId)
        return session
      } catch (error) {
        this.error = error
        throw error
      } finally { this.loading = false }
    },
    async setCurrentStep(currentStep) {
      if (!this.activeSession) throw new Error('请先加载体验 Session')
      this.activeSession = await dataAdapter.updateExperienceSession(this.activeSession.id, { currentStep })
      return this.activeSession
    },
    async completeSession(payload) {
      if (!this.activeSession) throw new Error('请先加载体验 Session')
      if (this.loading) return this.activeRecord
      this.loading = true
      this.error = null
      try {
        this.activeRecord = await dataAdapter.completeExperienceSession(this.activeSession.id, payload)
        this.activeSession = await dataAdapter.getExperienceSession(this.activeSession.id)
        this.addRecord(this.activeRecord)
        return this.activeRecord
      } catch (error) {
        this.error = error
        throw error
      } finally { this.loading = false }
    },
    async loadRecord(recordId) {
      this.activeRecord = await dataAdapter.getRecordById(recordId)
      return this.activeRecord
    },
    async loadRecords() { this.records = await dataAdapter.getRecords(); return this.records },
    addRecord(record) { this.records = [record, ...this.records.filter((item) => item.id !== record.id)] },
    resetExperience() {
      this.activeCourseId = null
      this.activeCourse = null
      this.activeSession = null
      this.activeRecord = null
      this.error = null
    },
  },
})
