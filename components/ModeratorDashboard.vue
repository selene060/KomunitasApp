<!-- components/dashboard/ModeratorDashboard.vue -->
<template>
    <div class="bg-white shadow overflow-hidden sm:rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900">Moderator Dashboard</h3>
        <div class="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <!-- Content Moderation Card -->
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <ShieldCheckIcon class="h-6 w-6 text-gray-400" />
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Pending Reviews</dt>
                    <dd class="text-lg font-medium text-gray-900">{{ pendingReviews }}</dd>
                  </dl>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-5 py-3">
              <div class="text-sm">
                <NuxtLink to="/moderation" class="font-medium text-indigo-600 hover:text-indigo-900">
                  Review Content
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
        <button
              class="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              @click="logout"
            >
              Logout
            </button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()

const logout = async () => {
  await authStore.logout()  // Call the logout action in the store
}
  const pendingReviews = ref(0)
  
  // Fetch pending reviews count
  onMounted(async () => {
    // Add API call to get pending reviews
  })
  </script>