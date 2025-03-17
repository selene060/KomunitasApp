<template>
  <div class="flex">
    <LeftSidebar class="w-1/4" />
    <div class="bg-[#F3F3FB] p-5 ml-16 w-full mr-[320px] h-screen font-poppins overflow-y-auto">
      <div class="mb-5 h-18 bg-[#F3F3FB] pt-3">
      </div>
      <div class="container mx-auto max-w-4xl">
        <NotifikasiNotificationCenter :selectedCommunityId="selectedCommunityId" />
      </div>
    </div>
    <MainRightSidebar class="w-1/4" />
  </div>
</template>

<script setup>
import { MainRightSidebar } from '#components'
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'


const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const selectedCommunityId = ref('')

// Check authentication and load data
onMounted(() => {
  // Authentication check
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }
  
  // Check for community ID in route params
  if (route.query.community) {
    selectedCommunityId.value = route.query.community
  }
})
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