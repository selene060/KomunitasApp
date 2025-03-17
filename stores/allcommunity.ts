import { defineStore } from 'pinia'
import { useRuntimeConfig } from '#app'

interface Community {
  id: number
  name: string
  description: string
  category_id: number
  category_name: string
  communities_type: string
  status: string
  rules: string
  subscription_price: string
  photo_community: string | null
  created_at: string
  updated_at: string
  member_count: number
  is_member: boolean
  user_role: string | null
  member_status: string | null
}

interface State {
  communities: Community[]
  loading: boolean
  error: string | null
}

export const useAllCommunityStore = defineStore('allCommunity', {
  state: (): State => ({
    communities: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchAllCommunities() {
      this.loading = true
      this.error = null
      
      try {
        const config = useRuntimeConfig()
        const token = localStorage.getItem('accessToken')
        
        console.log('Token being used:', token) // Debug log
        
        if (!token) {
          throw new Error('No authentication token found')
        }

        const response = await fetch(`${config.public.apiBase}/api/communities/`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        console.log('Raw API response:', data) // Debug log
        
        this.communities = data
      } catch (error) {
        console.error('Error fetching communities:', error)
        this.error = error instanceof Error ? error.message : 'Failed to fetch communities'
      } finally {
        this.loading = false
      }
    }
  }
})