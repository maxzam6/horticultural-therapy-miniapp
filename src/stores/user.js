import { defineStore } from 'pinia'
import { mockUser } from '@/mock'

const cloneMockUser = () => JSON.parse(JSON.stringify(mockUser))

export const useUserStore = defineStore('user', {
  state: () => ({
    user: cloneMockUser(),
    isAuthenticated: false,
  }),
  actions: {
    startMockSession() {
      this.user = cloneMockUser()
      this.isAuthenticated = true
    },
    saveProfile(profile) {
      this.user = {
        ...this.user,
        ...profile,
        profileCompleted: true,
      }
    },
  },
})
