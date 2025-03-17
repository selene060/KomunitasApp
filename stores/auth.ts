// stores/auth.ts
import { defineStore } from 'pinia'
import { navigateTo } from '#app'

// Type definitions
interface User {
  id: number | string
  email: string
  username: string
  role: string
  // Add other user properties as needed
}

interface AuthResponse {
  user: User
  access: string
  refresh: string
}

interface RefreshResponse {
  access: string
  refresh: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    accessToken: null as string | null,
    refreshToken: null as string | null,
    initialized: false
  }),

  getters: {
    isAuthenticated(): boolean {
      return !!this.accessToken && !!this.user
    },
    userRole(): string | null {
      return this.user?.role || null 
    },
    username(): string | null {
      return this.user?.username || null
    },
    isLoggedIn: (state) => !!state.user,
  },

  actions: {
    async login(email: string, password: string) {
      try {
        const config = useRuntimeConfig()
        const { data, error } = await useFetch<AuthResponse>(`${config.public.apiBase}/api/auth/login/`, {
          method: 'POST',
          body: { email, password },
          headers: {
            'Content-Type': 'application/json'
          }
        })
    
        if (error.value) {
          throw new Error(error.value.statusMessage || 'Login failed')
        }
    
        if (!data.value) {
          throw new Error('Invalid response from server')
        }
    
        const { user, access, refresh } = data.value
        
        await this.setAuthData(user, access, refresh)
    
        // Determine dashboard route based on user role
        const dashboardRoutes: Record<string, string> = {
          'superadmin': '/superadmin/dashboard',
          'moderator': '/moderator/dashboard',
          'user': '/user/dashboard'
        }
    
        const route = dashboardRoutes[user.role] || '/user/dashboard'
        navigateTo(route)
    
        return data.value
      } catch (error: any) {
        console.error('Login error:', error)
        throw new Error(error.message || 'Failed to login. Please try again.')
      }
    },

    async setAuthData(user: User, access: string, refresh: string) {
      // Update store state
      this.user = user
      this.accessToken = access
      this.refreshToken = refresh
      
      // Store tokens and user data in localStorage
      if (process.client) {
        localStorage.setItem('accessToken', access)
        localStorage.setItem('refreshToken', refresh)
        localStorage.setItem('user', JSON.stringify(user))
      }
    },

    async verifyAndRefreshAuth(): Promise<boolean> {
      if (!this.accessToken) return false

      const config = useRuntimeConfig()
      try {
        const { data, error } = await useFetch<User>(`${config.public.apiBase}/api/auth/profile`, {
          headers: {
            Authorization: `Bearer ${this.accessToken}`
          }
        })

        if (error.value) {
          // Token is invalid, try to refresh
          const refreshSuccessful = await this.refreshAuthToken()
          if (!refreshSuccessful) {
            throw new Error('Failed to refresh token')
          }
          // Retry the profile fetch with new token
          return await this.verifyAndRefreshAuth()
        }

        if (data.value) {
          this.user = data.value
          if (process.client) {
            localStorage.setItem('user', JSON.stringify(data.value))
          }
          return true
        }
        return false
      } catch (error) {
        console.error('Auth verification failed:', error)
        return false
      }
    },

    async refreshAuthToken(): Promise<boolean> {
      if (!this.refreshToken) return false

      const config = useRuntimeConfig()
      try {
        const { data, error } = await useFetch<RefreshResponse>(`${config.public.apiBase}/api/auth/refresh/`, {
          method: 'POST',
          body: {
            refresh: this.refreshToken
          }
        })

        if (error.value || !data.value) {
          throw new Error('Token refresh failed')
        }

        const { access, refresh } = data.value
        this.accessToken = access
        this.refreshToken = refresh

        if (process.client) {
          localStorage.setItem('accessToken', access)
          localStorage.setItem('refreshToken', refresh)
        }
        return true
      } catch (error) {
        console.error('Token refresh failed:', error)
        // Only logout if refresh actually failed
        if (error instanceof Error && error.message !== 'Token refresh failed') {
          this.logout()
        }
        return false
      }
    },

    async initAuth(): Promise<void> {
      if (this.initialized) return
      
      if (process.client) {
        const accessToken = localStorage.getItem('accessToken')
        const refreshToken = localStorage.getItem('refreshToken')
        const storedUser = localStorage.getItem('user')

        if (accessToken && refreshToken && storedUser) {
          this.accessToken = accessToken
          this.refreshToken = refreshToken
          try {
            this.user = JSON.parse(storedUser) as User
            // Verify token and refresh if needed
            const isValid = await this.verifyAndRefreshAuth()
            if (!isValid) {
              // Only clear if verification explicitly failed
              this.clearAuth()
            }
          } catch (error) {
            console.error('Failed to parse stored user:', error)
            this.clearAuth()
          }
        }
      }
      
      this.initialized = true
    },

    clearAuth(): void {
      this.user = null
      this.accessToken = null
      this.refreshToken = null

      if (process.client) {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
      }
    },

    logout(): void {
      this.clearAuth()
      navigateTo('/login')
    }
  }
})

// Helper function to get current user ID
export const getCurrentUserId = (): string | null => {
  const authStore = useAuthStore()
  return authStore.user?.id != null ? authStore.user.id.toString() : null
}