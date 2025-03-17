<template>
    <div class="bg-white overflow-hidden shadow rounded-lg">
      <div class="p-6">
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <h3 class="text-lg font-medium text-gray-900">{{ community.name }}</h3>
            <p class="mt-1 text-sm text-gray-500">{{ community.description }}</p>
          </div>
          <img 
            v-if="community.photo_community" 
            :src="community.photo_community" 
            class="h-16 w-16 rounded-full object-cover"
            :alt="community.name"
          />
        </div>
        
        <div class="mt-4 flex items-center space-x-2">
          <span 
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
            :class="typeClass"
          >
            {{ community.communities_type }}
          </span>
          <span 
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
            :class="statusClass"
          >
            {{ community.status }}
          </span>
          <span class="text-sm text-gray-500">
            {{ community.member_count }} members
          </span>
        </div>
  
        <div class="mt-4">
          <button
            v-if="!community.is_member"
            @click="$emit('join', community.id)"
            :disabled="loading"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <span v-if="loading">Joining...</span>
            <span v-else>Join Community</span>
          </button>
          <button
            v-else
            @click="$emit('leave', community.id)"
            :disabled="loading"
            class="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <span v-if="loading">Leaving...</span>
            <span v-else>Leave Community</span>
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue'
  
  const props = defineProps({
    community: {
      type: Object,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    }
  })
  
  const typeClass = computed(() => ({
    'bg-green-100 text-green-800': props.community.communities_type === 'free',
    'bg-purple-100 text-purple-800': props.community.communities_type === 'premium'
  }))
  
  const statusClass = computed(() => ({
    'bg-blue-100 text-blue-800': props.community.status === 'public',
    'bg-gray-100 text-gray-800': props.community.status === 'private'
  }))
  </script>