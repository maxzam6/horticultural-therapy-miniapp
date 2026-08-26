<script>
import { clearDemoStorage } from '@/services/storage'

export default {
  onLaunch() {
    if (import.meta.env.VITE_RESET_DEMO_ON_LAUNCH === 'true') {
      clearDemoStorage()
      console.info('[园艺疗法] Demo storage reset for a fresh-user presentation')
    }
    console.info('[园艺疗法] App launched in mock-first mode')
  },
}
</script>

<style lang="scss">
@use './styles/global.scss';
</style>
