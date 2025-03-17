<!-- components/CommunityJoinDialog.vue -->
<template>
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center">
      <!-- Backdrop -->
      <div 
        class="fixed inset-0 bg-black bg-opacity-50" 
        @click="handleCancel"
      ></div>
      
      <!-- Dialog -->
      <div class="relative bg-white rounded-lg w-full max-w-md p-6 shadow-xl">
        <!-- Header -->
        <div class="mb-4">
          <h3 class="text-lg font-semibold">
            Request to Join {{ communityName }}
          </h3>
          <p class="text-sm text-gray-600 mt-1">
            This is a private community. Please submit a request to join.
          </p>
        </div>
        
        <!-- Content -->
        <div class="space-y-4">
          <textarea
            v-model="message"
            placeholder="Why would you like to join this community? (Optional)"
            class="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
          ></textarea>
        </div>
        
        <!-- Footer -->
        <div class="mt-6 flex justify-end space-x-3">
          <button 
            @click="handleCancel"
            class="px-4 py-2 border rounded-md hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button 
            @click="handleSubmit"
            :disabled="isProcessing"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isProcessing ? 'Submitting...' : 'Submit Request' }}
          </button>
        </div>
  
        <!-- Close button -->
        <button 
          @click="handleCancel" 
          class="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <span class="text-xl">×</span>
        </button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  
  interface Props {
    isOpen: boolean
    communityName: string
    isProcessing: boolean
  }
  
  interface Emits {
    (e: 'update:open', value: boolean): void
    (e: 'submit', message: string): void
    (e: 'cancel'): void
  }
  
  const props = defineProps<Props>()
  const emit = defineEmits<Emits>()
  
  const message = ref('')
  
  const handleSubmit = () => {
    emit('submit', message.value)
    message.value = ''
  }
  
  const handleCancel = () => {
    message.value = ''
    emit('update:open', false)
    emit('cancel')
  }
  </script>