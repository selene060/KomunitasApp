<!-- components/dashboard/SuperAdminDashboard.vue -->
<template>
  <div class="bg-white shadow overflow-hidden sm:rounded-lg">
    <div class="px-4 py-5 sm:p-6">
      <!-- Welcome Message -->
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-gray-900">
          Welcome, {{ username }}!
        </h2>
        <p class="text-gray-600">Super Admin Dashboard</p>
      </div>

      <!-- Rest of your dashboard content -->
      <div class="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <!-- Your existing cards -->
      </div>
    </div>
    <button
          class="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
          @click="logout"
        >
          Logout
    </button>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { computed } from 'vue'

const logout = async () => {
  await authStore.logout()  // Call the logout action in the store
}
const authStore = useAuthStore()
const username = computed(() => authStore.username)

// Check if user has correct role
onMounted(() => {
  if (!authStore.checkAccess(['superadmin'])) {
    navigateTo('/unauthorized')
  }
})
</script>