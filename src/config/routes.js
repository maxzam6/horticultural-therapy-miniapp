export const ROUTES = Object.freeze({
  HOME: '/pages/home/index',
  AUTH: '/pages/auth/index',
  PROFILE_SETUP: '/pages/profile/setup',
  ASSESSMENT_INTRO: '/pages/assessment/intro',
  ASSESSMENT_QUESTIONS: '/pages/assessment/questions',
  ASSESSMENT_RESULT: '/pages/assessment/result',
  EXPLORE: '/pages/explore/index',
  GARDEN: '/pages/garden/index',
  COURSE_DETAIL: '/pages/course/detail',
  EXPERIENCE_TASK: '/pages/experience/task',
  IMPRINT_DETAIL: '/pages/imprint/detail',
  RECORDS: '/pages/records/index',
  COMMUNITY: '/pages/community/index',
  MINE: '/pages/mine/index',
})

export const TAB_ROUTES = new Set([
  ROUTES.HOME,
  ROUTES.EXPLORE,
  ROUTES.RECORDS,
  ROUTES.COMMUNITY,
  ROUTES.MINE,
])
