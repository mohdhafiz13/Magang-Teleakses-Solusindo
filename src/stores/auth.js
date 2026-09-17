import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    async login(credentials) {
      this.loading = true
      this.error = null

      // Simulasi delay panggil API
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Validasi Credential Spesifik
      if (credentials.username === 'magang1' && credentials.password === 'rahasia') {
        const dummyToken = 'jwt-token-teleaccess-2026'
        const dummyUser = { username: 'magang1', role: 'Supervisor' }

        this.token = dummyToken
        this.user = dummyUser

        localStorage.setItem('token', dummyToken)
        localStorage.setItem('user', JSON.stringify(dummyUser))

        this.loading = false
        return true
      } else {
        this.error = 'Username atau password salah!'
        this.loading = false
        return false
      }
    },
    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
  },
})