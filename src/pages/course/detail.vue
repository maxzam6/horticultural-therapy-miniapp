<script setup>
import { computed, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import AppPageShell from '@/components/AppPageShell.vue'
import { ROUTES } from '@/config/routes'
import { mockCourses } from '@/mock'
import { goTo } from '@/services/navigation'

const courseId = ref('course-succulent')
const course = computed(() => mockCourses.find((item) => item.id === courseId.value) || mockCourses[1])

onLoad((options) => {
  if (options?.id) courseId.value = options.id
})

const startTask = () => goTo(`${ROUTES.EXPERIENCE_TASK}?courseId=${course.value.id}`)
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
