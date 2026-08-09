import { TAB_ROUTES } from '@/config/routes'

export function goTo(url) {
  const path = url.split('?')[0]

  if (TAB_ROUTES.has(path)) {
    return uni.switchTab({ url: path })
  }

  return uni.navigateTo({ url })
}
