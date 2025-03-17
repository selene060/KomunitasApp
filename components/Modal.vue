<template>
    <div class="fixed inset-0 z-50 overflow-y-auto" 
         role="dialog"
         aria-modal="true">
      <div class="flex min-h-screen items-center justify-center p-4">
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
             @click="$emit('close')">
        </div>
  
        <!-- Modal Content -->
        <div class="relative z-50 w-full max-w-md transform overflow-hidden rounded-lg bg-white shadow-xl transition-all">
          <!-- Header -->
          <div class="bg-white px-4 pt-5 pb-4">
            <div class="text-lg font-medium leading-6 text-gray-900">
              <slot name="header"></slot>
            </div>
          </div>
  
          <!-- Body -->
          <div class="bg-white px-4 pt-5 pb-4">
            <slot name="body"></slot>
          </div>
  
          <!-- Footer -->
          <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  defineEmits(['close'])
  </script>