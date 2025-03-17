<!-- pages/dashboard/index.vue -->
<template>
    <div class="min-h-screen bg-gray-100">
      <NavBar />
      <div class="py-10">
        <header>
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 class="text-3xl font-bold leading-tight text-gray-900">
              {{ getDashboardTitle }}
            </h1>
          </div>
        </header>
        <main>
          <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <component :is="currentDashboard" />
          </div>
        </main>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '~/stores/auth'

// Import dashboard components
import SuperAdminDashboard from '~/components/SuperAdminDashboard.vue'
import ModeratorDashboard from '~/components/ModeratorDashboard.vue'
import UserDashboard from '~/components/UserDashboard.vue'

// Define middleware
definePageMeta({
  middleware: ['auth']
})

const authStore = useAuthStore()

// Compute which dashboard to show based on role
const currentDashboard = computed(() => {
  switch (authStore.userRole) {
    case 'superadmin':
      return SuperAdminDashboard
    case 'moderator':
      return ModeratorDashboard
    case 'user':
      return UserDashboard
    default:
      return null
  }
})

// Compute dashboard title
const getDashboardTitle = computed(() => {
  switch (authStore.userRole) {
    case 'superadmin':
      return 'Super Admin Dashboard'
    case 'moderator':
      return 'Moderator Dashboard'
    case 'user':
      return 'User Dashboard'
    default:
      return 'Dashboard'
  }
})
</script>
