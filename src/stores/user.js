import { defineStore } from 'pinia'
import { dataAdapter } from '@/services/data-adapter'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
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
    async startMockSession() {
      this.loading = true
      this.error = null
      try {
        this.user = await dataAdapter.mockLogin()
        this.isAuthenticated = true
        return this.user
      } catch (error) {
        this.isAuthenticated = false
        this.error = error
        throw error
      } finally {
        this.loading = false
      }
    },
    async saveProfile(profile) {
      this.user = await dataAdapter.saveUserProfile({ ...this.user, ...profile })
    },
    resetUser() {
      this.user = null
      this.isAuthenticated = false
      this.loading = false
      this.error = null
    },
  },
})
