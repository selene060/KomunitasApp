<template>
    <div>
      <div v-if="notifications.length === 0" class="text-center py-10 text-gray-500">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        <p>No notifications yet</p>
      </div>
      
      <ul v-else class="divide-y divide-gray-200">
        <li v-for="notification in notifications" :key="notification.id" class="py-4">
          <div class="flex items-center">
            <div class="w-10 h-10 rounded-full flex items-center justify-center mr-4" :class="getNotificationClass(notification)">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <div class="flex-1">
              <div class="flex items-center justify-between">
                <p class="font-medium">{{ notification.title }}</p>
                <span class="text-xs text-gray-500">{{ formatDate(notification.created_at) }}</span>
              </div>
              <p class="text-gray-600">{{ notification.message }}</p>
              <p v-if="notification.source" class="text-xs text-gray-500 mt-1">
                From: {{ notification.source }}
              </p>
            </div>
          </div>
        </li>
      </ul>
      
      <div v-if="notifications.length > 0" class="flex justify-between items-center mt-6 pt-6 border-t border-gray-200">
        <p class="text-sm text-gray-500">
          Showing {{ notifications.length }} of {{ total }} notifications
        </p>
        <div class="flex space-x-2">
          <button 
            @click="$emit('load-more')" 
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
          >
            Load More
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    notifications: {
      type: Array,
      required: true
    },
    total: {
      type: Number,
      default: 0
    }
  })
  
  defineEmits(['load-more'])
  
  const formatDate = (dateString) => {
    if (!dateString) return ''
    
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) {
      return 'Today'
    } else if (diffDays === 1) {
      return 'Yesterday'
    } else if (diffDays < 7) {
      return `${diffDays} days ago`
    } else {
      return date.toLocaleDateString('en-US', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
      })
    }
  }
  
  
  const getNotificationClass = (notification) => {
    const type = notification.type || 'default'
    
    const classes = {
      default: 'bg-blue-100 text-blue-500',
      system: 'bg-purple-100 text-purple-500',
      join_request: 'bg-green-100 text-green-500',
      warning: 'bg-yellow-100 text-yellow-500',
      error: 'bg-red-100 text-red-500'
    }
    
    return classes[type] || classes.default
  }
  </script>