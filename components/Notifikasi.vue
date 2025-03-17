<template>
  <div class="flex">
    <LeftSidebar class="w-1/4" />
    <div class="bg-[#F3F3FB] p-5 ml-16 w-full mr-[320px] h-screen font-poppins overflow-y-auto">
      <div class="mb-5 h-18 bg-[#F3F3FB] pt-3">
        
      </div>
    
      <div class="container mx-auto max-w-4xl">
       
        
        <div class="bg-white rounded-xl shadow-md">
          
          <div class="p-6">
          
            <div class="border-b border-gray-200 mb-6">
              <nav class="flex space-x-6">
                <button 
                  @click="currentTab = 'join-requests'"
                  class="px-1 py-4 border-b-2 font-medium text-sm transition-colors"
                  :class="currentTab === 'join-requests' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
                >
                  Join Requests
                  <span v-if="pendingRequests.length > 0" class="ml-2 bg-blue-100 text-blue-800 py-1 px-2 rounded-full text-xs">
                    {{ pendingRequests.length }}
                  </span>
                </button>
                
                <button 
                  @click="currentTab = 'all'"
                  class="px-1 py-4 border-b-2 font-medium text-sm transition-colors"
                  :class="currentTab === 'all' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
                >
                  All Notifications
                </button>
              </nav>
            </div>
            
            <!-- Loading State -->
            <div v-if="loading" class="text-center py-10">
              <svg class="animate-spin h-8 w-8 text-blue-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p class="mt-3 text-gray-600">Loading data...</p>
            </div>
            
            <!-- Error State -->
            <div v-else-if="error" class="bg-red-100 text-red-700 p-4 rounded-lg">
              {{ error }}
              <button @click="fetchData" class="ml-2 underline">Try again</button>
            </div>
            
            <!-- Join Requests Tab -->
            <div v-else-if="currentTab === 'join-requests'">
              <div v-if="pendingRequests.length === 0" class="text-center py-10 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                <p>No pending join requests</p>
              </div>
              
              <ul v-else class="divide-y divide-gray-200">
                <li v-for="request in pendingRequests" :key="request.id" class="py-6">
                  <div class="flex flex-col sm:flex-row sm:items-center justify-between">
                    <div class="flex items-center mb-4 sm:mb-0">
                      <div class="w-12 h-12 rounded-full overflow-hidden mr-4 bg-blue-100">
                        <img 
                          v-if="request.user_photo" 
                          :src="request.user_photo" 
                          :alt="request.user_name"
                          class="w-full h-full object-cover"
                        />
                        <div v-else class="w-full h-full flex items-center justify-center text-blue-500 font-bold">
                          {{ request.user_name.charAt(0) }}
                        </div>
                      </div>
                      <div>
                        <p class="font-medium">{{ request.user_name }}</p>
                        <p class="text-sm text-gray-500">{{ formatDate(request.requested_at) }}</p>
                        <p class="text-sm text-gray-600 mt-1">
                          Wants to join 
                          <span class="font-medium">{{ getCommunityName(request.community_id) }}</span>
                        </p>
                        <p v-if="request.request_message" class="mt-2 text-gray-700 p-3 bg-gray-50 rounded-lg">
                          "{{ request.request_message }}"
                        </p>
                      </div>
                    </div>
                    <div class="flex space-x-3">
                      <button 
                        @click="handleRequestAction(request.id, 'approve')" 
                        class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 text-sm font-medium"
                      >
                        Accept
                      </button>
                      <button 
                        @click="handleRequestAction(request.id, 'reject')" 
                        class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 text-sm font-medium"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            
            <!-- All Notifications Tab -->
            <div v-else-if="currentTab === 'all'">
              <div v-if="notifications.length === 0" class="text-center py-10 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <p>No notifications yet</p>
              </div>
              
              <ul v-else class="divide-y divide-gray-200">
                <li v-for="notification in notifications" :key="notification.id" class="py-4">
                  <div class="flex items-center">
                    <div class="w-10 h-10 rounded-full flex items-center justify-center mr-4" :class="getNotificationIconClass(notification.type)">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                    </div>
                    <div>
                      <p class="font-medium">{{ notification.title }}</p>
                      <p class="text-gray-600">{{ notification.message }}</p>
                      <p class="text-sm text-gray-500 mt-1">{{ formatDate(notification.created_at) }}</p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <RightSidebar class="w-1/4" />
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRuntimeConfig } from '#app'
import { useJoinRequestStore } from '~/stores/joinRequest'
import { storeToRefs } from 'pinia'
import { useAllCommunityStore } from '~/stores/allcommunity'
import LeftSidebar from '~/components/LeftSidebar.vue'
import RightSidebar from '~/components/main/RightSidebar.vue'

const config = useRuntimeConfig()
const route = useRoute()
const router = useRouter()

const joinRequestStore = useJoinRequestStore()
const allCommunityStore = useAllCommunityStore()
const { pendingRequests, loading: joinRequestsLoading, error: joinRequestsError } = storeToRefs(joinRequestStore)

// UI state
const loading = ref(false)
const error = ref(null)
const currentTab = ref('join-requests')
const selectedCommunityId = ref('')
const adminCommunities = ref([])
const notifications = ref([])
const notificationsLoading = ref(false)
const notificationsError = ref(null)

// Computed: Selected community details
const selectedCommunity = computed(() => {
  if (!selectedCommunityId.value) return null
  return adminCommunities.value.find(c => c.id === selectedCommunityId.value) || null
})

// Computed: Overall loading and error states
const isLoading = computed(() => loading.value || joinRequestsLoading.value || notificationsLoading.value)
const hasError = computed(() => error.value || joinRequestsError.value || notificationsError.value)
const errorMessage = computed(() => error.value || joinRequestsError.value || notificationsError.value || '')

// Initialize component
onMounted(async () => {
  // Get communities where user is admin
  await fetchAdminCommunities()
  
  // Check query param for community ID
  if (route.query.community) {
    selectedCommunityId.value = route.query.community
  }
  
  updateRouteParams()
  
  // Initial data fetch
  await fetchData()
})

// Handle community selection change
const handleCommunityChange = () => {
  updateRouteParams()
  fetchData()
}

// Update query parameters
const updateRouteParams = () => {
  router.replace({
    query: {
      ...route.query,
      community: selectedCommunityId.value || undefined
    }
  })
}

// Fetch communities where user is admin
const fetchAdminCommunities = async () => {
  try {
    loading.value = true
    // Use store to get communities or fetch directly
    const communities = await allCommunityStore.getAdminCommunities()
    adminCommunities.value = communities
  } catch (err) {
    console.error('Failed to fetch admin communities:', err)
    error.value = 'Failed to load communities list. Please try again.'
  } finally {
    loading.value = false
  }
}

// Fetch notification data based on selected community
const fetchData = async () => {
  try {
    error.value = null
    
    // Fetch join requests using the store
    await joinRequestStore.fetchPendingRequests(selectedCommunityId.value)
    
    // Fetch other notifications
    await fetchNotifications()
  } catch (err) {
    console.error('Failed to fetch data:', err)
    error.value = 'Failed to load notifications. Please try again.'
  }
}

// Fetch general notifications
const fetchNotifications = async () => {
  try {
    notificationsLoading.value = true
    notificationsError.value = null
    
    const config = useRuntimeConfig()
    const token = localStorage.getItem('accessToken')
    
    if (!token) {
      throw new Error('Authentication required')
    }
    
    // Build the URL with optional community filter
    let url = `${config.public.apiBase}/api/notifications/`
    if (selectedCommunityId.value) {
      url += `?community_id=${selectedCommunityId.value}`
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch notifications')
    }
    
    notifications.value = data.data || []
  } catch (err) {
    console.error('Failed to fetch notifications:', err)
    notificationsError.value = err instanceof Error ? err.message : 'An unknown error occurred'
    notifications.value = []
  } finally {
    notificationsLoading.value = false
  }
}

// Handle join request actions (approve/reject)
const handleRequestAction = async (requestId, action) => {
  try {
    // Use the store method to process the request
    const success = await joinRequestStore.processRequest(requestId, action)
    
    if (success) {
      // Success handling could be added here
    }
  } catch (err) {
    console.error(`Failed to ${action} request:`, err)
    error.value = `Failed to ${action} request. Please try again.`
  }
}

// Get community name by ID
const getCommunityName = (communityId) => {
  const community = adminCommunities.value.find(c => c.id === communityId)
  return community ? community.name : 'Community'
}

// Format date for display
const formatDate = (dateString) => {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

// Get notification icon class based on type
const getNotificationIconClass = (type) => {
  const classes = {
    'info': 'bg-blue-100 text-blue-500',
    'success': 'bg-green-100 text-green-500',
    'warning': 'bg-yellow-100 text-yellow-500',
    'error': 'bg-red-100 text-red-500',
    'join-request': 'bg-purple-100 text-purple-500'
  }
  
  return classes[type] || classes['info']
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

::-webkit-scrollbar {
  display: none;
}

* {
  font-family: 'Poppins', sans-serif;
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>