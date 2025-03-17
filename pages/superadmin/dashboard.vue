// pages/dashboard/index.vue
<template>
  <div class="min-h-screen bg-gray-100">
    <NavBar />
    <div class="py-10">
      <header>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 class="text-3xl font-bold leading-tight text-gray-900">Dashboardd</h1>
        </div>
      </header>
      <main>
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <SuperAdminDashboard />
          </div>
      </main>
    </div>
    <NuxtLink to="/superadmin/categories">Categories</NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useRouter } from 'vue-router'

import SuperAdminDashboard from '~/components/SuperAdminDashboard.vue'
import ModeratorDashboard from '~/components/ModeratorDashboard.vue'
import UserDashboard from '~/components/UserDashboard.vue'

const authStore = useAuthStore()
const router = useRouter()
 // Define middleware for this page

onMounted(() => {
  // Check authentication on component mount
  if (!authStore.isAuthenticated) {
    router.push('/login')
  }
})

// Optional: watch for auth state changes
watch(() => authStore.isAuthenticated, (isAuthenticated) => {
  if (!isAuthenticated) {
    router.push('/login')
  }
})

</script>
