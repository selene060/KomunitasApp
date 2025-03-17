<script setup>
import { ref } from 'vue'

const email = ref('')
const username = ref('')
const password = ref('')

const handleSubmit = () => {
  // Handle the form submission, e.g., call an API to register the user
  console.log('Form submitted', { email: email.value, username: username.value, password: password.value })
}
</script>

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
      <label class="block text-sm font-medium text-gray-700">Username</label>
      <input
        v-model="username"
        type="text"
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
    <button
      type="submit"
      class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700"
    >
      Register
    </button>
  </form>
</template>
