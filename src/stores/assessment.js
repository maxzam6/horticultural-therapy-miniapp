import { defineStore } from 'pinia'
import { mockAssessmentQuestions } from '@/mock'
import { dataAdapter } from '@/services/data-adapter'

export const useAssessmentStore = defineStore('assessment', {
  state: () => ({
    questions: mockAssessmentQuestions,
    answers: {},
    currentIndex: 0,
    result: null,
    submissionStatus: 'idle',
    error: null,
  }),
  actions: {
    async loadQuestions() { this.questions = await dataAdapter.getAssessmentQuestions(); return this.questions },
    setAnswer(questionCode, value) {
      this.answers[questionCode] = value
    },
    goPrevious() { this.currentIndex = Math.max(0, this.currentIndex - 1) },
    goNext() { this.currentIndex = Math.min(this.questions.length - 1, this.currentIndex + 1) },
    setResult(result) { this.result = result; this.submissionStatus = 'succeeded' },
    reset() {
      this.answers = {}
      this.result = null
      this.currentIndex = 0
      this.submissionStatus = 'idle'
      this.error = null
    },
    resetAssessment() { this.reset() },
  },
})
