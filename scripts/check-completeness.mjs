import assert from 'node:assert/strict'
import fs from 'node:fs'
import { getGrowthLevel, summarizeGrowth } from '../src/services/growth-service.js'

const expectedLevels = [
  [0, '等待启程'],
  [1, '初识自然'],
  [2, '自然探索者'],
  [3, '自然探索者'],
  [4, '五感漫游者'],
  [5, '五感漫游者'],
  [6, '自然同行者'],
  [12, '自然同行者'],
]
expectedLevels.forEach(([count, level]) => {
  assert.equal(getGrowthLevel(count), level, `invalid growth level for ${count} records`)
})

const summary = summarizeGrowth([
  { sense: 'touch', duration: 20 },
  { sense: 'touch', duration: '15' },
  { sense: 'visual', duration: 'invalid' },
  { sense: '', duration: -10 },
])
assert.deepEqual(summary, {
  completedCount: 4,
  exploredSenseCount: 2,
  totalMinutes: 35,
  level: '五感漫游者',
})
assert.deepEqual(summarizeGrowth([]), {
  completedCount: 0,
  exploredSenseCount: 0,
  totalMinutes: 0,
  level: '等待启程',
})

const recordsPage = fs.readFileSync(new URL('../src/pages/records/index.vue', import.meta.url), 'utf8')
assert.match(recordsPage, /experienceStore\.loadRecords\(\)/, 'P12 must load Records through experienceStore')
assert.match(recordsPage, /recordId=\$\{encodeURIComponent\(recordId\)\}/, 'P12 must only route with encoded recordId')
assert.doesNotMatch(recordsPage, /@\/mock|data-adapter|services\/storage|STORAGE_KEYS/, 'P12 must not read Mock, Adapter or Storage')
assert.match(recordsPage, /summary\.completedCount/, 'P12 must display completedCount')
assert.match(recordsPage, /summary\.exploredSenseCount/, 'P12 must display exploredSenseCount')
assert.match(recordsPage, /summary\.totalMinutes/, 'P12 must display totalMinutes')

const storeSource = fs.readFileSync(new URL('../src/stores/experience.js', import.meta.url), 'utf8')
assert.match(storeSource, /growthSummary:\s*\(state\)\s*=>\s*summarizeGrowth\(state\.records\)/, 'Store must expose the shared growth summary')

const communityPage = fs.readFileSync(new URL('../src/pages/community/index.vue', import.meta.url), 'utf8')
assert.match(communityPage, /自然分享空间，未来开放。/, 'P14 future-space copy is required')
assert.doesNotMatch(communityPage, /发帖|评论|点赞|收藏|私信|关注|input|textarea|button/, 'P14 must not expose social interactions')
console.log('Product completeness check passed.')
