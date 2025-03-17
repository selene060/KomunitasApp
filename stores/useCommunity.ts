import { defineStore } from 'pinia'

interface Community {
  id: number
  name: string
  description?: string
  category_id: number
  communities_type: 'free' | 'premium'
  status: 'public' | 'private'
  rules?: string
  subscription_price: number
}

interface Category {
  id: number
  name: string
}

export const useCommunityStore = defineStore('community', {
  state: () => ({
    communities: [] as Community[],
    categories: [] as Category[],
    loading: false,
    error: null as Error | null,
    form: {
      name: '',
      description: '',
      category_id: 0,
      communities_type: 'free' as 'free' | 'premium',
      status: 'public' as 'public' | 'private',
      rules: '',
      subscription_price: 0
    }
  }),

  actions: {
    async fetchCommunities() {
      const config = useRuntimeConfig()
      this.loading = true
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(`${config.public.apiBase}/api/communities/`, {
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json'
          }
        })
        
        if (!response.ok) throw new Error('Failed to fetch communities')
        this.communities = await response.json()
      } catch (e) {
        this.error = e instanceof Error ? e : new Error(String(e))
      } finally {
        this.loading = false
      }
    },
    
    async fetchCategories() {
      const config = useRuntimeConfig()
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(`${config.public.apiBase}/api/communities/get_categories/`, {
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json'
          }
        })
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.detail || 'Failed to fetch categories')
        }
        
        this.categories = await response.json()
      } catch (e) {
        this.error = e instanceof Error ? e : new Error(String(e))
      }
    },

    async createCommunity() {
      try {
        const response = await fetch('/api/communities/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
          },
          body: JSON.stringify(this.form)
        })
        
        if (!response.ok) throw new Error('Failed to create community')
        
        await this.fetchCommunities()
        return true
      } catch (e) {
        this.error = e instanceof Error ? e : new Error(String(e))
        return false
      }
    },

    async updateCommunity(id: number) {
      try {
        const response = await fetch(`/api/communities/${id}/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
          },
          body: JSON.stringify(this.form)
        })
        
        if (!response.ok) throw new Error('Failed to update community')
        
        await this.fetchCommunities()
        return true
      } catch (e) {
        this.error = e instanceof Error ? e : new Error(String(e))
        return false
      }
    },

    async deleteCommunity(id: number) {
      try {
        const response = await fetch(`/api/communities/${id}/`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
          }
        })
        
        if (!response.ok) throw new Error('Failed to delete community')
        
        await this.fetchCommunities()
        return true
      } catch (e) {
        this.error = e instanceof Error ? e : new Error(String(e))
        return false
      }
    },

    async joinCommunity(id: number) {
      try {
        const response = await fetch(`/api/communities/${id}/join/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
          }
        })
        
        if (!response.ok) throw new Error('Failed to join community')
        
        await this.fetchCommunities()
        return true
      } catch (e) {
        this.error = e instanceof Error ? e : new Error(String(e))
        return false
      }
    },

    async leaveCommunity(id: number) {
      try {
        const response = await fetch(`/api/communities/${id}/leave/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
          }
        })
        
        if (!response.ok) throw new Error('Failed to leave community')
        
        await this.fetchCommunities()
        return true
      } catch (e) {
        this.error = e instanceof Error ? e : new Error(String(e))
        return false
      }
    }
  }
})