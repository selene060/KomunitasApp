<template>
    <div class="bg-white rounded-xl shadow-md">
      <div class="p-6">
       
        <div class="border-b border-gray-200 mb-6">
          <nav class="flex space-x-6">
            <button 
              @click="activeTab = 'join-requests'"
              class="px-1 py-4 border-b-2 font-medium text-sm transition-colors"
              :class="activeTab === 'join-requests' ? 'border-[#FFCD64] text-[#3845AD]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
            >
              Join Requests
              <span v-if="pendingRequestsCount > 0" class="ml-2 bg-blue-100 text-blue-800 py-1 px-2 rounded-full text-xs">
                {{ pendingRequestsCount }}
              </span>
            </button>
            
            <button 
              @click="activeTab = 'all'"
              class="px-1 py-4 border-b-2 font-medium text-sm transition-colors"
              :class="activeTab === 'all' ? 'border-[#FFCD64] text-[#3845AD]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
            >
              All Notifications
            </button>
          </nav>
        </div>
        
      
        <div v-if="loading" class="text-center py-10">
          <LoadingSpinner />
        </div>
        
    
        <div v-else-if="error" class="bg-red-100 text-red-700 p-4 rounded-lg">
          {{ error }}
          <button @click="fetchData" class="ml-2 underline">Try again</button>
        </div>
        
    
        <div v-else-if="activeTab === 'join-requests'">
          <NotifikasiJoinRequestsList 
            :requests="pendingRequests" 
            :adminCommunities="adminCommunities"
            @process-request="handleRequestAction"
          />
        </div>
        
    
        <div v-else-if="activeTab === 'all'">
          <NotifikasiNotificationList 
            :notifications="notifications" 
            :total="notificationStats.total"
            @load-more="loadMoreNotifications"
          />
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useRuntimeConfig } from '#app'
  import { useJoinRequestStore } from '~/stores/joinRequest'
  import { storeToRefs } from 'pinia'
  import LoadingSpinner from './LoadingSpinner.vue'
  
  const props = defineProps({
    selectedCommunityId: {
      type: String,
      default: ''
    }
  })
  
  const config = useRuntimeConfig()
  const route = useRoute()
  const router = useRouter()
  const joinRequestStore = useJoinRequestStore()
  
  // State variables
  const activeTab = ref('join-requests')
  const loading = ref(true)
  const error = ref(null)
  const notifications = ref([])
  const pendingRequests = ref([])
  const pendingRequestsCount = ref(0)
  const adminCommunities = ref([])
  const notificationStats = ref({
    total: 0,
    unread: 0
  })
  const currentPage = ref(1)
  const limit = ref(10)
  
  // Watch for community ID changes
  watch(() => props.selectedCommunityId, () => {
    fetchData()
  })
  
  // Initialize component
  onMounted(async () => {
    fetchData()
    fetchAdminCommunities()
  })
  
  // Fetch all required data
  const fetchData = async () => {
    try {
      loading.value = true
      error.value = null
      
      await Promise.all([
        fetchNotificationStats(),
        fetchAllNotifications(),
        fetchPendingRequests()
      ])
    } catch (err) {
      console.error('Failed to fetch data:', err)
      error.value = 'Failed to load notifications. Please try again.'
    } finally {
      loading.value = false
    }
  }
  
  // Get notification stats
  const fetchNotificationStats = async () => {
    try {
      const response = await fetch(`${config.public.apiBase}/api/notifications/stats`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      })
      const data = await response.json()
      
      if (data.success) {
        notificationStats.value = data.stats
      }
    } catch (error) {
      console.error('Error fetching notification stats:', error)
    }
  }
  
  // Fetch all notifications
  const fetchAllNotifications = async () => {
    try {
      let url = `${config.public.apiBase}/api/notifications?page=${currentPage.value}&limit=${limit.value}`
      
      if (props.selectedCommunityId) {
        url += `&community_id=${props.selectedCommunityId}`
      }
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      })
      const data = await response.json()
      
      if (data.success) {
        if (currentPage.value === 1) {
          notifications.value = data.notifications
        } else {
          notifications.value = [...notifications.value, ...data.notifications]
        }
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }
  
  // Fetch pending join requests
  const fetchPendingRequests = async () => {
    try {
      // Use the store to fetch pending requests
      await joinRequestStore.fetchPendingRequests(props.selectedCommunityId)
      
      // Get data from the store
      const { pendingRequests: storeRequests, pendingRequestsCount: storeCount } = storeToRefs(joinRequestStore)
      pendingRequests.value = storeRequests.value || []
      pendingRequestsCount.value = storeCount.value || 0
    } catch (error) {
      console.error('Error fetching pending requests:', error)
    }
  }
  
  // Fetch communities where user is admin
  const fetchAdminCommunities = async () => {
    try {
      const response = await fetch(`${config.public.apiBase}/api/communities/admin`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      })
      const data = await response.json()
      
      if (data.success) {
        adminCommunities.value = data.communities
      }
    } catch (error) {
      console.error('Error fetching admin communities:', error)
    }
  }
  
  // Load more notifications
  const loadMoreNotifications = () => {
    currentPage.value++
    fetchAllNotifications()
  }
  
  // Handle join request actions (approve/reject)
  const handleRequestAction = async (requestId, action) => {
    try {
      // Use the store method to process the request
      const success = await joinRequestStore.processRequest(requestId, action)
      
      if (success) {
        // Refresh data after action
        fetchPendingRequests()
      }
    } catch (error) {
      console.error(`Failed to ${action} request:`, error)
    }
  }
  </script>