import assert from 'node:assert/strict'
import fs from 'node:fs'
import { mockAssessmentQuestions } from '../src/mock/assessment-questions.js'
import { mockCourses } from '../src/mock/courses.js'
import { mockRecords } from '../src/mock/records.js'
import { mockUser } from '../src/mock/user.js'

const sessionFields = ['id', 'courseId', 'status', 'currentStep', 'startedAt', 'completedAt', 'recordId']
const recordFields = ['id', 'sessionId', 'userId', 'courseId', 'courseTitle', 'sense', 'mood', 'feeling', 'imageUrl', 'completedAt', 'duration', 'growthIdentity']
const succulent = mockCourses.find((course) => course.id === 'course-succulent')

assert.equal(mockCourses.length, 5, 'five course ids must remain unchanged')
assert.ok(succulent, 'succulent course is required')
assert.ok(succulent.materials.length > 0, 'succulent materials are required')
assert.ok(succulent.safetyTips.length > 0, 'succulent safety tips are required')
assert.ok(succulent.steps.length >= 4 && succulent.steps.length <= 6, 'succulent course must have 4–6 steps')
assert.ok(succulent.steps.every((step) => step.id && step.title && step.description && 'image' in step), 'invalid succulent step')
assert.ok(mockRecords.every((record) => recordFields.every((field) => field in record)), 'example records must follow the frozen contract')

const source = fs.readFileSync(new URL('../src/services/data-adapter.js', import.meta.url), 'utf8')
  .replace(/^import[\s\S]*?from ['"]@\/mock['"]\r?\n/m, '')
  .replace(/^import .*?from ['"].*?['"]\r?\n/gm, '')
  .replace(/import\.meta\.env\.VITE_DATA_MODE/g, "'mock'")
  .replace(/import\.meta\.env\.DEV/g, 'true')
  .replace(/export const /g, 'const ')
  .replace(/export \{ mockAdapter, realAdapter \}\r?\n/, '')
  .concat('\nreturn { mockAdapter }')

const storage = new Map()
const STORAGE_KEYS = {
  user: 'horticulture:user', latestAssessment: 'horticulture:latest-assessment',
  activeSession: 'horticulture:active-session', records: 'horticulture:records',
}
const getStorage = (key, fallback = null) => storage.has(key) ? structuredClone(storage.get(key)) : structuredClone(fallback)
const setStorage = (key, value) => { storage.set(key, structuredClone(value)); return true }
const { mockAdapter } = new Function(
  'mockAssessmentQuestions', 'mockCourses', 'mockRecords', 'mockUser', 'getStorage', 'setStorage', 'STORAGE_KEYS',
  source,
)(mockAssessmentQuestions, mockCourses, mockRecords, mockUser, getStorage, setStorage, STORAGE_KEYS)

const session = await mockAdapter.startExperienceSession('course-succulent')
assert.deepEqual(Object.keys(session).sort(), sessionFields.sort(), 'Session fields must match C009')
assert.equal(session.status, 'active')
assert.equal((await mockAdapter.startExperienceSession('course-succulent')).id, session.id, 'repeated start must reuse active Session')

const beforeCount = (await mockAdapter.getRecords()).length
const payload = { mood: '平静', feeling: '完成了多肉种植。', imageUrl: '' }
const [first, repeated] = await Promise.all([
  mockAdapter.completeExperienceSession(session.id, payload),
  mockAdapter.completeExperienceSession(session.id, payload),
])
assert.equal(first.id, repeated.id, 'repeated completion must return the same recordId')
assert.ok(recordFields.every((field) => field in first), 'generated Record must follow C009')
assert.equal('emotion' in first || 'reflection' in first, false, 'Record must only use mood and feeling')
const records = await mockAdapter.getRecords()
assert.equal(records.length, beforeCount + 1, 'Record count must increase once')
assert.equal(records.filter((record) => record.sessionId === session.id).length, 1, 'one Session must map to one Record')
assert.equal((await mockAdapter.completeExperienceSession(session.id, payload)).id, first.id, 'completed Session must restore existing Record')
assert.equal((await mockAdapter.getExperienceSession(session.id)).recordId, first.id, 'completed Session recordId must stay stable')

const pageSource = fs.readFileSync(new URL('../src/pages/experience/task.vue', import.meta.url), 'utf8')
assert.doesNotMatch(pageSource, /@\/mock|services\/storage/, 'P10 must not read Mock or Storage directly')
assert.match(pageSource, /decodeURIComponent\(options\.sessionId\)/, 'P10 must read the encoded sessionId route parameter')
console.log(`Experience check passed: ${session.id} -> ${first.id}, records +1.`)
