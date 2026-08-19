const DIMENSIONS = ['emotion', 'stress', 'nature']

function assertValidInput(questions, answers) {
  if (!Array.isArray(questions) || questions.length !== 10) {
    throw new Error('状态探索题目必须恰好为 10 题')
  }
  for (const question of questions) {
    const value = Number(answers?.[question.code])
    if (!Number.isInteger(value) || value < 1 || value > 5) {
      throw new Error(`题目 ${question.code} 的答案无效`)
    }
    if (!DIMENSIONS.includes(question.dimension)) {
      throw new Error(`题目 ${question.code} 的维度无效`)
    }
  }
}

export function scoreAssessment(questions, answers) {
  assertValidInput(questions, answers)
  const scores = Object.fromEntries(DIMENSIONS.map((dimension) => [dimension, []]))

  questions.forEach((question) => {
    const raw = Number(answers[question.code])
    const value = question.reverse ? 6 - raw : raw
    scores[question.dimension].push(value)
  })

  const dimensions = Object.fromEntries(DIMENSIONS.map((dimension) => {
    const values = scores[dimension]
    const mean = values.reduce((sum, value) => sum + value, 0) / values.length
    return [dimension, Math.round(((mean - 1) / 4) * 100)]
  }))

  const experienceOverviewScore = Math.round(
    0.4 * dimensions.emotion
      + 0.3 * (100 - dimensions.stress)
      + 0.3 * dimensions.nature,
  )

  return {
    submissionId: `assessment-${Date.now()}`,
    experienceOverviewScore,
    emotion: { score: dimensions.emotion, label: labelFor(dimensions.emotion) },
    stress: { score: dimensions.stress, label: labelFor(dimensions.stress) },
    nature: { score: dimensions.nature, label: labelFor(dimensions.nature) },
    recommendedCourseId: 'course-succulent',
    createdAt: new Date().toISOString(),
  }
}

function labelFor(score) {
  if (score >= 75) return '较高'
  if (score >= 50) return '中等'
  return '较低'
}
