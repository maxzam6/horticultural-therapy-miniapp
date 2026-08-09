import { defineStore } from 'pinia'
import { mockCourses, mockRecords } from '@/mock'

export const useExperienceStore = defineStore('experience', {
  state: () => ({
    courses: mockCourses,
    records: mockRecords,
    activeSession: null,
  }),
})
