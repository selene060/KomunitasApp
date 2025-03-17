import { defineStore } from 'pinia'
import { useRuntimeConfig } from 'nuxt/app'

interface ApiResponse {
  message: string;
  data?: any;
}

interface JoinRequest {
  id: string;
  community_id: string;
  user_id: string;
  user_name: string;
  user_photo?: string;
  status: string;
  request_message: string;
  requested_at: string;
}

interface JoinRequestState {
  pendingRequests: JoinRequest[];
  loading: boolean;
  error: string | null;
}

export const useJoinRequestStore = defineStore('joinRequest', {
  state: (): JoinRequestState => ({
    pendingRequests: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchPendingRequests(communityId?: string) {
      console.log('Starting fetchPendingRequests', communityId ? `for community: ${communityId}` : 'for all communities')
      this.loading = true
      this.error = null

      try {
        const config = useRuntimeConfig()
        const token = localStorage.getItem('accessToken')
        
        if (!token) {
          throw new Error('Authentication required')
        }

        // Build URL with optional community filter
        let url = `${config.public.apiBase}/api/communities/join-requests/pending/`
        if (communityId) {
          url += `?community_id=${communityId}`
        }

        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        const data = await response.json()
        console.log('Received join requests data:', data)

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch pending requests')
        }

        this.pendingRequests = data.data || []
      } catch (err) {
        console.error('Error in fetchPendingRequests:', err)
        this.error = err instanceof Error ? err.message : 'An unknown error occurred'
        this.pendingRequests = []
      } finally {
        this.loading = false
      }
    },

    async processRequest(requestId: string, action: 'approve' | 'reject') {
      this.loading = true
      this.error = null
      
      try {
        const config = useRuntimeConfig()
        const token = localStorage.getItem('accessToken')

        if (!token) {
          throw new Error('Authentication required')
        }

        const response = await fetch(
          `${config.public.apiBase}/api/communities/join-requests/${requestId}/process/`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ action })
          }
        )

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Failed to process request')
        }

        // Remove the processed request from the current list
        this.pendingRequests = this.pendingRequests.filter(req => req.id !== requestId)
        return true
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'An unknown error occurred'
        return false
      } finally {
        this.loading = false
      }
    }
  }
})