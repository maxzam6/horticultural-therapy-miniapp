import { defineStore } from 'pinia'
import { mockCourses, mockRecords } from '@/mock'
import { dataAdapter } from '@/services/data-adapter'

export const useExperienceStore = defineStore('experience', {
  state: () => ({
    courses: mockCourses,
    records: mockRecords,
    activeSession: null,
    activeCourseId: null,
    loading: false,
    error: null,
  }),
  actions: {
    async loadCourses() { this.courses = await dataAdapter.getCourses(); return this.courses },
    selectCourse(courseId) { this.activeCourseId = courseId },
    async loadRecords() { this.records = await dataAdapter.getRecords(); return this.records },
    addRecord(record) { this.records = [record, ...this.records.filter((item) => item.id !== record.id)] },
    resetExperience() { this.activeCourseId = null; this.activeSession = null; this.error = null },
  },
})
