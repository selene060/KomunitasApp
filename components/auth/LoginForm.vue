// components/auth/LoginForm.vue
<template>
  <form @submit.prevent="handleSubmit" class="space-y-4 max-w-md mx-auto">
    <div>
      <label class="block text-sm font-medium text-gray-700">Email</label>
      <input
        v-model="email"
        type="email"
        required
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      />
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700">Password</label>
      <input
        v-model="password"
        type="password"
        required
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
      />
    </div>
    
    <div v-if="error" class="text-red-500 text-sm">
      {{ error }}
    </div>

    <button
      type="submit"
      :disabled="loading"
      class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      <span v-if="loading">
        <svg class="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
        </svg>
      </span>
      {{ loading ? 'Logging in...' : 'Login' }}
    </button>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '~/stores/auth'

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const authStore = useAuthStore()

async function handleSubmit() {
  error.value = ''
  loading.value = true

  try {
    await authStore.login(email.value, password.value)
  } catch (err: any) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>