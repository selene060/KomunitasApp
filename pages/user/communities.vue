<template>
  <div class="flex">
    <LeftSidebar class="w-1/4" />
    <div class="bg-[#F3F3FB] p-5 ml-16 w-full mr-[320px] h-screen font-poppins overflow-y-auto">
      <div class="mb-5 h-18 bg-[#F3F3FB] pt-3">
        <div class="relative">
          <input type="text" class="w-full h-14 px-9 border-[1.5px] border-[#3845AD] rounded-full text-sm focus:outline-none leading-none min-h-[50px]" placeholder="Search...">
          <div class="absolute left-3 top-1/2 -translate-y-1/2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
          </div>
        </div>
      </div>
      <h2 class="text-[#4a4a4a] text-2xl font-semibold mt-9 mb-5 ml-2">My Communities</h2>
      
      <CommunityList />
    </div>
    <MainRightSidebar class="w-1/4" />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useRouter } from 'vue-router'
import { MainRightSidebar } from '#components'

const authStore = useAuthStore()
const router = useRouter()

onMounted(() => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
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
