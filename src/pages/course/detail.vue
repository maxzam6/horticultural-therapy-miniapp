<script setup>
import { computed, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import AppPageShell from '@/components/AppPageShell.vue'
import { ROUTES } from '@/config/routes'
import { goTo } from '@/services/navigation'
import { useExperienceStore } from '@/stores/experience'

const courseId = ref('course-succulent')
const experienceStore = useExperienceStore()
const course = computed(() => (
  experienceStore.courses.find((item) => item.id === courseId.value)
  || experienceStore.courses[0]
  || { id: courseId.value, senseName: '自然体验', title: '园艺体验' }
))

onLoad(async (options) => {
  if (options?.id) courseId.value = options.id
  experienceStore.selectCourse(courseId.value)
  await experienceStore.loadCourses()
})

const startTask = () => {
  const sessionId = `mock-session-${course.value.id}`
  goTo(`${ROUTES.EXPERIENCE_TASK}?sessionId=${encodeURIComponent(sessionId)}`)
}
</script>

<template>
  <AppPageShell
    :eyebrow="course.senseName"
    :title="course.title"
    description="课程详情结构已建立，材料、步骤和专业安全提示将在 P09 任务中补齐。"
    status="P09 动态 courseId 路由已就绪"
    button-label="开始体验任务"
    @primary="startTask"
  />
</template>
