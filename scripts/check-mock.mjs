import assert from 'node:assert/strict'
import { mockUser } from '../src/mock/user.js'
import { mockAssessmentQuestions } from '../src/mock/assessment-questions.js'
import { mockCourses } from '../src/mock/courses.js'
import { mockRecords } from '../src/mock/records.js'

const unique = (items) => new Set(items).size === items.length
assert.equal(Boolean(mockUser?.id), true, 'user must have an id')
assert.equal(mockAssessmentQuestions.length, 10, 'assessment must contain exactly 10 questions')
assert.equal(unique(mockAssessmentQuestions.map((q) => q.code)), true, 'question code must be unique')
assert.equal(mockAssessmentQuestions.every((q) => ['emotion', 'stress', 'nature'].includes(q.dimension)), true, 'invalid assessment dimension')
assert.equal(mockCourses.length, 5, 'courses must contain exactly 5 items')
assert.equal(unique(mockCourses.map((course) => course.id)), true, 'course id must be unique')
assert.equal(mockCourses.some((course) => course.id === 'course-succulent'), true, 'succulent course is required')
assert.equal(mockRecords.length >= 1, true, 'at least one example record is required')
assert.equal(unique(mockRecords.map((record) => record.id)), true, 'record id must be unique')
assert.equal(mockRecords.every((record) => record.courseId && record.completedAt), true, 'record must contain courseId and completedAt')
console.log('Mock data check passed.')
