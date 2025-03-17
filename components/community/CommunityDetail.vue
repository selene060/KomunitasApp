<template>
    <div 
      class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
      @click.self="$emit('close')"
    >
      <div 
        class="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl transform transition-all duration-300"
      >
        <!-- header -->
        <div class="bg-[#3845AD] text-white p-6 rounded-t-2xl">
          <div class="flex items-center">
            <div class="w-20 h-20 rounded-full overflow-hidden mr-6 border-4 border-white">
              <img 
                v-if="community.photo_community"
                :src="community.photo_community" 
                :alt="community.name"
                class="w-full h-full object-cover"
              />
              <div 
                v-else 
                class="w-full h-full bg-blue-100 flex items-center justify-center text-4xl font-bold text-blue-500"
              >
                {{ community.name.charAt(0) }}
              </div>
            </div>
            <div class="flex-1">
              <h2 class="text-2xl font-bold mb-2">{{ community.name }}</h2>
              <div class="flex items-center space-x-2">
                <span 
                  class="px-3 py-1 rounded-full text-sm font-medium"
                  :class="{
                    'bg-green-100 text-green-800': community.status === 'public',
                    'bg-yellow-100 text-yellow-800': community.status === 'private'
                  }"
                >
                  {{ community.status }} Community
                </span>
                <div class="flex items-center space-x-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                  </svg>
                  <span>{{ formatMemberCount(community.member_count) }}</span>
                </div>
              </div>
            </div>
            
            <!-- notifikasi admin -->
            <!-- <div v-if="isAdmin" class="relative">
              <button 
                @click="toggleJoinRequests"
                class="p-2 hover:bg-blue-600 rounded-full transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span 
                  v-if="pendingRequests.length > 0" 
                  class="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full"
                >
                  {{ pendingRequests.length }}
                </span>
              </button>
            </div> -->
          </div>
        </div>
  
        <button 
          @click="$emit('close')" 
          class="absolute top-4 right-4 text-white hover:bg-blue-600 p-2 rounded-full transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
  
        <div class="p-6 space-y-6">
          <!-- list join request -->
          <!-- <div v-if="isAdmin && showJoinRequests" class="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 class="text-lg font-semibold mb-3 text-gray-800">Join Request</h3>
            
            <div v-if="loadingRequests" class="text-center py-4">
              <p>Loading request...</p>
            </div>
            
            <div v-else-if="requestError" class="p-3 bg-red-100 text-red-600 rounded-lg">
              {{ requestError }}
            </div>
            
            <div v-else-if="pendingRequests.length === 0" class="text-center py-3 text-gray-600">
              <p>No join requests.</p>
            </div>
            
            <ul v-else class="divide-y divide-gray-200">
              <li v-for="request in pendingRequests" :key="request.id" class="py-3">
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <div class="w-10 h-10 rounded-full overflow-hidden mr-3 bg-blue-100">
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
                      <p v-if="request.request_message" class="mt-1 text-gray-600 text-sm">{{ request.request_message }}</p>
                    </div>
                  </div>
                  <div class="flex space-x-2">
                    <button 
                      @click="handleRequestAction(request.id, 'approve')" 
                      class="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
                    >
                      Accept
                    </button>
                    <button 
                      @click="handleRequestAction(request.id, 'reject')" 
                      class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </li>
            </ul>
          </div> -->
  
         
          <div>
            <h3 class="text-xl font-semibold mb-3 text-gray-800">About the Community</h3>
            <p class="text-gray-600">{{ community.description || 'Tidak ada deskripsi' }}</p>
          </div>
  
         
          <div class="grid grid-cols-2 gap-4">
            <div>
              <h4 class="font-medium text-gray-700 mb-2">Category</h4>
              <p class="text-gray-600">{{ community.category_name || 'Tidak Terkategori' }}</p>
            </div>
            
            <div v-if="community.communities_type === 'premium'">
              <h4 class="font-medium text-gray-700 mb-2">Subscibe</h4>
              <p class="text-gray-600">${{ formatPrice(community.subscription_price) }} / month</p>
            </div>
  
            <div v-if="community.user_role">
              <h4 class="font-medium text-gray-700 mb-2">Your Role</h4>
              <p class="text-gray-600">{{ community.user_role }}</p>
            </div>
          </div>
  
          <div class="flex space-x-4 mt-6">
            <button 
              v-if="!community.is_member && community.status === 'public'"
              @click="openJoinConfirmation"
              class="flex-1 bg-[#3845AD] text-white py-3 rounded-lg hover:bg-[#2f3a94] transition-colors"
            >
              Join the Community
            </button>
            
            <button 
              v-if="!community.is_member && community.status === 'private' && !hasRequestedJoin"
              @click="openRequestJoinModal"
              class="flex-1 bg-[#3845AD] text-white py-3 rounded-lg hover:bg-[#2f3a94] transition-colors"
            >
              Request to Join
            </button>
  
            
            <button 
              v-if="!community.is_member && community.status === 'private' && hasRequestedJoin"
              class="flex-1 bg-gray-400 text-white py-3 rounded-lg cursor-not-allowed"
              disabled
            >
             Request is Being Processed
            </button>
            
            <button 
              v-if="community.is_member"
              @click="openLeaveConfirmation"
              class="flex-1 bg-[#F65035] text-white py-3 rounded-lg hover:bg-[#d8432a] transition-colors"
            >
              Leave Community
            </button>
  
          </div>
        </div>
  
        <!-- konfirmasi join -->
        <div 
          v-if="showJoinConfirmation" 
          class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
        >
          <div class="bg-white rounded-2xl p-8 max-w-md w-full">
            <h3 class="text-2xl font-bold mb-4 text-center">Join the Community</h3>
            <p class="text-gray-600 mb-6 text-center">Are you sure you want to join "{{ community.name }}"?</p>
            <div class="flex space-x-4">
              <button 
                @click="handleJoin"
                class="flex-1 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Yes, Join
              </button>
              <button 
                @click="showJoinConfirmation = false"
                class="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
  
        <!-- request join -->
        <div 
          v-if="showRequestJoinModal" 
          class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
        >
          <div class="bg-white rounded-2xl p-8 max-w-md w-full">
            <h3 class="text-2xl font-bold mb-4 text-center">Request to Join</h3>
            <p class="text-gray-600 mb-4 text-center">
              This is a private community. Send a request to the community admin.
            </p>
            <div class="mb-4">
              <label class="block text-gray-700 mb-2">Message (Optional)</label>
              <textarea 
                v-model="joinRequestMessage" 
                rows="3" 
                class="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tell the atmin why you want to join..."
              ></textarea>
            </div>
            <div class="flex space-x-4">
              <button 
                @click="handleRequestJoin"
                class="flex-1 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors"
                :disabled="isSubmitting"
              >
                <span v-if="isSubmitting">Sending...</span>
                <span v-else>Send Request</span>
              </button>
              <button 
                @click="showRequestJoinModal = false"
                class="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
  
        <!-- keluar komunitas -->
        <div 
          v-if="showLeaveConfirmation" 
          class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
        >
          <div class="bg-white rounded-2xl p-8 max-w-md w-full">
            <h3 class="text-2xl font-bold mb-4 text-center">Leave the Community</h3>
            <p class="text-gray-600 mb-6 text-center">Are you sure want to leave "{{ community.name }}" community?</p>
            <div class="flex space-x-4">
              <button 
                @click="handleLeave"
                class="flex-1 bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-colors"
              >
                Yes, Leave
              </button>
              <button 
                @click="showLeaveConfirmation = false"
                class="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, watch } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useCommunityMembership } from '~/composable/useCommunityMembership'
  import { useAllCommunityStore } from '~/stores/allcommunity'
  import { useJoinRequestStore } from '~/stores/joinRequest'
  import { useRuntimeConfig } from '#app'
  
  const config = useRuntimeConfig()
  
  const props = defineProps({
    community: {
      type: Object,
      required: true
    }
  })
  
  const emit = defineEmits(['close'])
  
  const allCommunityStore = useAllCommunityStore()
  const joinRequestStore = useJoinRequestStore()
  const { requestJoinCommunity, joinCommunity } = useCommunityMembership()
  
  // Mendapatkan permintaan bergabung dari store
  const { pendingRequests } = storeToRefs(joinRequestStore)
  const loadingRequests = ref(false)
  const requestError = ref(null)
  
  // Confirmation modal states
  const showJoinConfirmation = ref(false)
  const showLeaveConfirmation = ref(false)
  const showRequestJoinModal = ref(false)
  const showJoinRequests = ref(false)
  const joinRequestMessage = ref('')
  const isSubmitting = ref(false)
  const hasRequestedJoin = ref(false)
  
  // Computed property to check if user is admin
  const isAdmin = computed(() => {
    return props.community.user_role === 'admin' || props.community.user_role === 'owner'
  })
  
  // Format helpers
  const formatMemberCount = (count) => {
    return `${count} ${count === 1 ? 'anggota' : 'anggota'}`
  }
  
  const formatPrice = (price) => {
    return parseFloat(price).toFixed(2)
  }
  
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }
  
  // Toggle join requests panel and fetch data
  const toggleJoinRequests = async () => {
    showJoinRequests.value = !showJoinRequests.value
    
    if (showJoinRequests.value && isAdmin.value) {
      await fetchPendingRequests()
    }
  }
  
  // Fetch pending join requests
  const fetchPendingRequests = async () => {
    if (!isAdmin.value) return
    
    loadingRequests.value = true
    requestError.value = null
    
    try {
      await joinRequestStore.fetchPendingRequests(props.community.id)
      console.log('Fetched pending requests:', pendingRequests.value)
    } catch (error) {
      console.error('Error fetching pending requests:', error)
      requestError.value = 'Gagal memuat permintaan. Silakan coba lagi.'
    } finally {
      loadingRequests.value = false
    }
  }
  
  // Handle admin actions on join requests
  const handleRequestAction = async (requestId, action) => {
    try {
      const success = await joinRequestStore.processRequest(requestId, action)
      
      if (success) {
        // Refresh data
        await allCommunityStore.fetchAllCommunities()
        await fetchPendingRequests()
      }
    } catch (error) {
      console.error(`Error ${action} request:`, error)
    }
  }
  
  // Check if user has already requested to join
  const checkJoinRequestStatus = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      
      if (!token) {
        throw new Error('Authentication required')
      }
      
      const response = await fetch(`${config.public.apiBase}/api/communities/${props.community.id}/join-request-status/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      const data = await response.json()
      
      if (response.ok && data.hasRequestedJoin) {
        hasRequestedJoin.value = true
      }
    } catch (error) {
      console.error('Error checking join request status:', error.message)
    }
  }
  
  // Open confirmation modals
  const openJoinConfirmation = () => {
    showJoinConfirmation.value = true
  }
  
  const openLeaveConfirmation = () => {
    showLeaveConfirmation.value = true
  }
  
  const openRequestJoinModal = () => {
    showRequestJoinModal.value = true
  }
  
  // Handle join and leave actions
  const handleLeave = async () => {
    try {
      const response = await fetch(`${config.public.apiBase}/api/communities/${props.community.id}/leave/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        }
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || 'Gagal keluar dari komunitas');
      }
  
      await allCommunityStore.fetchAllCommunities();
      showLeaveConfirmation.value = false
      emit('close')
    } catch (error) {
      console.error('Error leaving community:', error.message);
    }
  };
  
  const handleJoin = async () => {
    try {
      const result = await joinCommunity(props.community.id)
      
      if (result.success) {
        await allCommunityStore.fetchAllCommunities();
        showJoinConfirmation.value = false
        emit('close')
      }
    } catch (error) {
      console.error('Error joining community:', error.message);
    }
  };
  
  const handleRequestJoin = async () => {
    isSubmitting.value = true
    
    try {
      const result = await requestJoinCommunity(props.community.id, joinRequestMessage.value)
      
      if (result.success) {
        showRequestJoinModal.value = false
        hasRequestedJoin.value = true
        joinRequestMessage.value = ''
      }
    } catch (error) {
      console.error('Error requesting to join community:', error.message)
    } finally {
      isSubmitting.value = false
    }
  }
  
  // Watch for community ID changes to fetch relevant requests
  watch(() => props.community.id, () => {
    if (isAdmin.value && showJoinRequests.value) {
      fetchPendingRequests()
    }
  })
  
  // Load data on component mount
  onMounted(async () => {
    if (props.community.status === 'private' && !props.community.is_member) {
      await checkJoinRequestStatus()
    }
    
    if (isAdmin.value) {
      await fetchPendingRequests()
    }
  })
  </script>