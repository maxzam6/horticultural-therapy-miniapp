import {
  mockAssessmentQuestions,
  mockCourses,
  mockRecords,
  mockUser,
} from '@/mock'

const clone = (value) => JSON.parse(JSON.stringify(value))

export const dataMode = import.meta.env.VITE_DATA_MODE || 'mock'

export const dataAdapter = {
  async getCurrentUser() {
    return clone(mockUser)
  },
  async getAssessmentQuestions() {
    return clone(mockAssessmentQuestions)
  },
  async getCourses() {
    return clone(mockCourses)
  },
  async getRecords() {
    return clone(mockRecords)
  },
}
