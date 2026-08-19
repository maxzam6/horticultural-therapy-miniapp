import assert from 'node:assert/strict'
import { mockAssessmentQuestions } from '../src/mock/assessment-questions.js'
import { scoreAssessment } from '../src/services/assessment-service.js'

const answers = Object.fromEntries(mockAssessmentQuestions.map((question) => [question.code, 3]))
const result = scoreAssessment(mockAssessmentQuestions, answers)
assert.deepEqual(
  {
    emotion: result.emotion.score,
    stress: result.stress.score,
    nature: result.nature.score,
    experienceOverviewScore: result.experienceOverviewScore,
  },
  { emotion: 50, stress: 50, nature: 50, experienceOverviewScore: 50 },
)
assert.equal(result.recommendedCourseId, 'course-succulent')
assert.throws(() => scoreAssessment(mockAssessmentQuestions, { ...answers, E1: 0 }), /答案无效/)
assert.throws(() => scoreAssessment(mockAssessmentQuestions, { ...answers, E1: undefined }), /答案无效/)
console.log('Assessment scoring check passed.')
