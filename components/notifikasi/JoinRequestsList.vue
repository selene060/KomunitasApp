<template>
    <div>
      <div v-if="requests.length === 0" class="text-center py-10 text-gray-500">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
        <p>No pending join requests</p>
      </div>
      
      <ul v-else class="divide-y divide-gray-200">
        <li v-for="request in requests" :key="request.id" class="py-6">
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
                @click="$emit('process-request', request.id, 'approve')" 
                class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 text-sm font-medium"
              >
                Accept
              </button>
              <button 
                @click="$emit('process-request', request.id, 'reject')" 
                class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 text-sm font-medium"
              >
                Reject
              </button>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    requests: {
      type: Array,
      required: true
    },
    adminCommunities: {
      type: Array,
      default: () => []
    }
  })
  
  defineEmits(['process-request'])
  

  const getCommunityName = (communityId) => {
    const community = props.adminCommunities.find(c => c.id === communityId)
    return community ? community.name : 'Community'
  }
  

  const formatDate = (dateString) => {
    if (!dateString) return ''
    
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) {
      return 'Today'
    } else if (diffDays === 1) {
      return 'Yesterday'
    } else if (diffDays < 7) {
      return `${diffDays} days ago`
    } else {
      return date.toLocaleDateString('en-US', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
      })
    }
  }
  </script>