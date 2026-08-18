import { defineStore } from 'pinia'
import { mockUser } from '@/mock'
import { dataAdapter } from '@/services/data-adapter'

const cloneMockUser = () => JSON.parse(JSON.stringify(mockUser))

export const useUserStore = defineStore('user', {
  state: () => ({
    user: cloneMockUser(),
    isAuthenticated: false,
    loading: false,
    error: null,
  }),
  actions: {
    async loadCurrentUser() {
      this.loading = true
      this.error = null
      try { this.user = await dataAdapter.getCurrentUser(); this.isAuthenticated = Boolean(this.user?.id) }
      catch (error) { this.error = error; throw error }
      finally { this.loading = false }
    },
    startMockSession() {
      this.user = cloneMockUser()
      this.isAuthenticated = true
    },
    async saveProfile(profile) {
      this.user = await dataAdapter.saveUserProfile({ ...this.user, ...profile })
    },
    resetUser() {
      this.user = cloneMockUser()
      this.isAuthenticated = false
      this.loading = false
      this.error = null
    },
  },
})
