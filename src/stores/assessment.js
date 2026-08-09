import { defineStore } from 'pinia'
import { mockAssessmentQuestions } from '@/mock'

export const useAssessmentStore = defineStore('assessment', {
  state: () => ({
    questions: mockAssessmentQuestions,
    answers: {},
    result: null,
  }),
  actions: {
    setAnswer(questionCode, value) {
      this.answers[questionCode] = value
    },
    reset() {
      this.answers = {}
      this.result = null
    },
  },
})
