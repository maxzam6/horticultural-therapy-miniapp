import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const root = process.cwd()
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8')
const exists = (relativePath) => fs.existsSync(path.join(root, relativePath))

const pageConfig = JSON.parse(read('src/pages.json'))
const expectedPages = [
  'pages/home/index',
  'pages/auth/index',
  'pages/profile/setup',
  'pages/assessment/intro',
  'pages/assessment/questions',
  'pages/assessment/result',
  'pages/explore/index',
  'pages/garden/index',
  'pages/course/detail',
  'pages/experience/task',
  'pages/imprint/detail',
  'pages/records/index',
  'pages/community/index',
  'pages/mine/index',
]
const expectedTabs = [
  'pages/home/index',
  'pages/explore/index',
  'pages/records/index',
  'pages/community/index',
  'pages/mine/index',
]

assert.deepEqual(pageConfig.pages.map((page) => page.path), expectedPages, 'the 14-page set or order changed')
assert.deepEqual(pageConfig.tabBar.list.map((tab) => tab.pagePath), expectedTabs, 'the 5-tab set or order changed')

for (const page of expectedPages) {
  assert.equal(exists(`src/${page}.vue`), true, `missing page file: ${page}.vue`)
}

const routesSource = read('src/config/routes.js')
for (const route of expectedPages) {
  assert.match(routesSource, new RegExp(`['"]/${route.replaceAll('/', '\\/')}['"]`), `route is missing: /${route}`)
}

function sourceFiles(directory) {
  const absoluteDirectory = path.join(root, directory)
  const result = []
  for (const entry of fs.readdirSync(absoluteDirectory, { withFileTypes: true })) {
    const relativePath = path.join(directory, entry.name)
    if (entry.isDirectory()) result.push(...sourceFiles(relativePath))
    else if (/\.(vue|js|json|scss)$/.test(entry.name)) result.push(relativePath)
  }
  return result
}

const allSourceFiles = sourceFiles('src')
const allSource = allSourceFiles.map((file) => read(file)).join('\n')
assert.doesNotMatch(allSource, /balanceIndex/, 'balanceIndex must not return to the product source')
assert.doesNotMatch(allSource, /https?:\/\//i, 'source must not depend on external business resource URLs')

function visibleText(file, source) {
  if (file.endsWith('.vue')) {
    const template = source.match(/<template(?:\s[^>]*)?>([\s\S]*?)<\/template>/i)?.[1] || ''
    const literals = [...source.matchAll(/(['"`])([\s\S]*?)\1/g)].map((match) => match[2])
    return `${template}\n${literals.join('\n')}`
  }
  return [...source.matchAll(/(['"`])([\s\S]*?)\1/g)].map((match) => match[2]).join('\n')
}

const visibleFiles = [
  ...expectedPages.map((page) => `src/${page}.vue`),
  'src/components/AppPageShell.vue',
  'src/mock/courses.js',
]
const forbiddenVisibleTerms = [
  [/\bmock\b/i, 'Mock'],
  [/\bP(?:0[1-9]|1[0-4])\b/, 'page id'],
  [/\b(?:A|B|C)\d{3}\b/, 'task id'],
  [/骨架|待开发|开发中|待甲方确认/, 'internal delivery status'],
  [/balanceIndex/i, 'balanceIndex'],
]
for (const file of visibleFiles) {
  const text = visibleText(file, read(file))
  for (const [pattern, label] of forbiddenVisibleTerms) {
    assert.doesNotMatch(text, pattern, `${label} leaked into user-visible content: ${file}`)
  }
}

const adapterSource = read('src/services/data-adapter.js')
assert.match(adapterSource, /VITE_DATA_MODE/, 'VITE_DATA_MODE switch is missing')
assert.match(adapterSource, /import\.meta\.env\.VITE_DATA_MODE\s*\|\|\s*['"]mock['"]/, 'Mock must remain the default data mode')

const homePage = read('src/pages/home/index.vue')
assert.match(homePage, /userStore\.loadCurrentUser\(\)/, 'home CTA must resolve the persisted user before routing')
assert.match(homePage, /profileCompleted/, 'home CTA must distinguish first-time profile setup')
assert.match(homePage, /assessmentStore\.loadLatestResult\(\)/, 'home CTA must resolve the persisted assessment')
assert.match(homePage, /ROUTES\.EXPLORE/, 'returning users must be able to enter Explore directly')

const authPage = read('src/pages/auth/index.vue')
assert.match(authPage, /user\?\.profileCompleted/, 'auth must not reopen profile setup for returning users')

const explorePage = read('src/pages/explore/index.vue')
assert.match(explorePage, /重新评估/, 'explore must expose a retake assessment entry')
assert.match(explorePage, /ROUTES\.ASSESSMENT_INTRO/, 'retake assessment must preserve the assessment intro path')
assert.doesNotMatch(explorePage, /import AppCard|<AppCard\b/, 'explore must avoid the custom card relation path on mini-program runtime')

const trackedResult = spawnSync('git', ['ls-files'], { cwd: root, encoding: 'utf8' })
assert.equal(trackedResult.status, 0, 'git ls-files failed')
const trackedFiles = trackedResult.stdout.split(/\r?\n/).filter(Boolean)
const forbiddenTracked = trackedFiles.filter((file) =>
  /^(dist\/|project\.private\.config\.json$|\.env(?:$|\.(?!example$))|.*\/\.env(?:$|\.(?!example$)))/.test(file),
)
assert.deepEqual(forbiddenTracked, [], 'build output or private environment files must not be tracked')

const trackedText = trackedFiles
  .filter((file) => file !== 'scripts/check-demo.mjs')
  .filter((file) => /\.(vue|js|json|ts|mjs)$/.test(file))
  .map((file) => read(file))
  .join('\n')
assert.doesNotMatch(trackedText, /appSecret|secretKey|cloudBaseEnv|databasePassword/i, 'private credentials must not be tracked')

console.log('Demo delivery check passed: 14 pages, 5 tabs, frozen routes, Mock default, no release leakage.')
