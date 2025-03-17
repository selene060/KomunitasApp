<template>
  <div class="flex">
    <LeftSidebar class="w-1/4" />
    <div class="bg-[#F3F3FB] p-5 ml-16 w-full mr-[320px] h-screen font-poppins overflow-y-auto">
      
      <div class="flex justify-center gap-20 mb-5 px-5">
        <button 
          v-for="tab in tabs" 
          :key="tab"
          @click="activeTab = tab"
          class="py-2.5 text-base font-semibold text-[#3845AD] cursor-pointer relative"
          :class="{'after:content-[\'\'] after:absolute after:bottom-[-1px] after:left-0 after:w-full after:h-[3px] after:bg-[#FFD700]': activeTab === tab}"
        >
          {{ tab }}
        </button>
      
      </div>

      <div v-if="activeTab === 'For you'">
        <UserDashboard />
      </div>
      
      <div v-else-if="activeTab === 'My Communities'">
        
      </div>
      <UserpostPostModal 
        v-if="showPostModal" 
        @close="showPostModal = false"
        @post-created="handlePostCreation"
      />
    </div>
    <MainRightSidebar class="w-1/4" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useRouter } from 'vue-router'
import { MainRightSidebar, UserpostPostModal } from '#components'
import UserDashboard from '~/components/UserDashboard.vue'

const authStore = useAuthStore()
const router = useRouter()

const activeTab = ref('For you')
const showPostModal = ref(false)
const tabs = ['For you', 'My Communities']

onMounted(() => {
  // Check authentication on component mount
  if (!authStore.isAuthenticated) {
    router.push('/login')
  }
})

// Watch for auth state changes
watch(() => authStore.isAuthenticated, (isAuthenticated) => {
  if (!isAuthenticated) {
    router.push('/login')
  }
})

const handlePostCreation = (postData) => {
  // Logic to handle post creation
  console.log('New post created:', postData)
  showPostModal.value = false
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