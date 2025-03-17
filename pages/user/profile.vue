<template>
  <div class="flex">
    <LeftSidebar class="w-1/4" />
    <div class="bg-[#F3F3FB] p-5 ml-16 w-full mr-[320px] h-screen font-poppins overflow-y-auto">
      <div class="flex justify-between items-center">
        <h1 class="text-xl font-medium">Profile</h1>
        <button 
          @click="handleLogout"
          class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </div>
    <MainRightSidebar class="w-1/4" />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useRouter } from 'vue-router'
import LeftSidebar from '~/components/LeftSidebar.vue'
import { MainRightSidebar } from '#components'

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = () => {
  authStore.logout() // Panggil fungsi logout dari store
  router.push('/login') // Redirect ke halaman login
}

onMounted(() => {
  // Check authentication on component mount
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
