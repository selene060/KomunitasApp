<!-- pages/unauthorized.vue -->
<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
      <div class="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        <div class="text-center">
          <h2 class="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p class="text-gray-600 mb-6">
            You don't have permission to access this page.
          </p>
          <button
            @click="goBack"
            class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  const router = useRouter()
  
  const goBack = () => {
    router.back()
  }
  </script>