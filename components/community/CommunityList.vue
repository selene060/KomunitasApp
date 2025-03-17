<template>
    <div class="container mx-auto px-4 py-6">
      <div v-if="loading" class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
      </div>
  
      <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {{ error }}
      </div>
  
      <!-- My Communities Section -->
      <div v-if="myCommunities.length > 0">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="community in myCommunities" 
            :key="community.id"
            class="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
  
            <div class="p-6">
              <div class="flex items-center mb-4">
                <div class="w-16 h-16 rounded-full overflow-hidden mr-4 border-2 border-blue-500">
                  <img 
                    v-if="community.photo_community"
                    :src="community.photo_community" 
                    :alt="community.name"
                    class="w-full h-full object-cover"
                    @error="handleImageError"
                  />
                  <div 
                    v-else 
                    class="w-full h-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-500"
                  >
                    {{ community.name.charAt(0) }}
                  </div>
                </div>
                <div>
                  <h3 class="text-xl font-semibold text-gray-800">{{ community.name }}</h3>
                  <p class="text-sm text-gray-500">{{ community.communities_type }}</p>
                </div>
              </div>
  
              <div class="flex justify-between items-center mb-4">
                <div class="flex items-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                  </svg>
                  <span class="text-gray-700">{{ formatMemberCount(community.member_count) }}</span>
                </div>
                
                <div class="flex space-x-2">
                  <button 
                    @click="openCommunityDetails(community)"
                    class="bg-[#3845AD] text-white px-3 py-2 rounded-full hover:bg-[#2f3a94] transition-colors flex items-center space-x-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Details</span>
                  </button>
  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Communities to Join Section -->
      <div v-if="availableCommunities.length > 0" class="mt-12">
        <h2 class="text-[#4a4a4a] text-2xl font-semibold mb-5 ml-2">Communities to Join</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="community in availableCommunities" 
            :key="community.id"
            class="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            <!-- Same community card structure as above -->
            <div class="p-6">
              <div class="flex items-center mb-4">
                <div class="w-16 h-16 rounded-full overflow-hidden mr-4 border-2 border-blue-500">
                  <img 
                    v-if="community.photo_community"
                    :src="community.photo_community" 
                    :alt="community.name"
                    class="w-full h-full object-cover"
                    @error="handleImageError"
                  />
                  <div 
                    v-else 
                    class="w-full h-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-500"
                  >
                    {{ community.name.charAt(0) }}
                  </div>
                </div>
                <div>
                  <h3 class="text-xl font-semibold text-gray-800">{{ community.name }}</h3>
                  <p class="text-sm text-gray-500">{{ community.communities_type }}</p>
                </div>
              </div>
  
              <div class="flex justify-between items-center mb-4">
                <div class="flex items-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                  </svg>
                  <span class="text-gray-700">{{ formatMemberCount(community.member_count) }}</span>
                </div>
                
                <div class="flex space-x-2">
                  <button 
                    @click="openCommunityDetails(community)"
                    class="bg-[#3845AD] text-white px-3 py-2 rounded-full hover:bg-[#2f3a94] transition-colors flex items-center space-x-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Details</span>
                  </button>
  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- No Communities Message -->
      <div v-if="myCommunities.length === 0 && availableCommunities.length === 0" class="text-center text-gray-500 py-10">
        No communities found
      </div>
  
      <!-- Community Details Modal -->
      <CommunityDetail 
        v-if="selectedCommunity" 
        :community="selectedCommunity"
        @close="closeCommunityDetails"
      />
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useAllCommunityStore } from '~/stores/allcommunity'
  import CommunityDetail from '~/components/community/CommunityDetail.vue'
  
  const allCommunityStore = useAllCommunityStore()
  
  const selectedCommunity = ref(null)
  const error = computed(() => allCommunityStore.error)
  const loading = computed(() => allCommunityStore.loading)
  const communities = computed(() => allCommunityStore.communities)
  
  // Computed properties to separate communities
  const myCommunities = computed(() => 
    communities.value.filter(community => community.is_member)
  )
  
  const availableCommunities = computed(() => 
    communities.value.filter(community => !community.is_member)
  )
  
  const formatMemberCount = (count) => {
    return `${count} ${count === 1 ? 'member' : 'members'}`
  }
  
  const handleImageError = (event) => {
    event.target.style.display = 'none'
    const fallbackElement = event.target.nextElementSibling
    if (fallbackElement) {
      fallbackElement.style.display = 'flex'
    }
  }
  
  const openCommunityDetails = (community) => {
    selectedCommunity.value = community
  }
  
  const closeCommunityDetails = () => {
    selectedCommunity.value = null
  }
  
  onMounted(async () => {
    try {
      await allCommunityStore.fetchAllCommunities()
    } catch (err) {
      allCommunityStore.error = 'Failed to load communities'
    }
  })
  </script>