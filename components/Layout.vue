<template>
    <div class="min-h-screen bg-gray-50">
      <!-- Top Navigation -->
      <nav class="bg-white border-b sticky top-0 z-50">
        <div class="max-w-5xl mx-auto px-4">
          <div class="flex items-center justify-between h-16">
            <div class="flex space-x-12">
              <NuxtLink to="/" class="text-2xl font-bold text-blue-600">Logo</NuxtLink>
              <div class="flex space-x-8">
                <NuxtLink 
                  to="/" 
                  class="inline-flex flex-col items-center px-1 pt-1 text-gray-900 relative"
                  active-class="text-blue-600"
                >
                  For you
                  <div class="absolute bottom-0 w-full h-0.5 bg-blue-500"></div>
                </NuxtLink>
                <NuxtLink 
                  to="/communities" 
                  class="inline-flex items-center px-1 pt-1 text-gray-600 hover:text-gray-900"
                  active-class="text-blue-600"
                >
                  My Communities
                </NuxtLink>
              </div>
            </div>
            
            <!-- Search Bar -->
            <div class="flex items-center">
              <div class="relative">
                <input 
                  type="text"
                  placeholder="Search..."
                  class="w-64 pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                <div class="absolute left-3 top-2.5 text-gray-400">
                  <i class="fas fa-search"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
  
      <!-- Main Content -->
      <main class="max-w-5xl mx-auto px-4 py-6">
        <div class="grid grid-cols-3 gap-6">
          <!-- Feed Content -->
          <div class="col-span-2">
            <slot />
          </div>
  
          <!-- Right Sidebar -->
          <div class="space-y-6">
            <!-- Premium Card -->
            <div class="bg-white rounded-xl p-6 border border-gray-200">
              <h2 class="text-xl font-semibold mb-2">Upgrade to premium</h2>
              <p class="text-gray-600 mb-4">Subscribe to access new features and, if eligible, receive a share of revenue</p>
              <button class="w-full px-4 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors">
                Subscribe
              </button>
            </div>
  
            <!-- Explore Communities -->
            <div class="bg-white rounded-xl p-6 border border-gray-200">
              <h2 class="text-xl font-semibold mb-4">Explore New Community</h2>
              <div class="space-y-3">
                <div v-for="i in 4" :key="i" class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 bg-gray-200 rounded-full"></div>
                    <span class="font-medium">Community {{ i }}</span>
                  </div>
                  <button class="px-4 py-1 text-sm bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                    join
                  </button>
                </div>
              </div>
            </div>
  
            <!-- Popular Hashtags -->
            <div class="bg-white rounded-xl p-6 border border-gray-200">
              <h2 class="text-xl font-semibold mb-4">Popular Hashtag</h2>
              <div class="space-y-4">
                <div v-for="i in 4" :key="i" class="flex items-center justify-between">
                  <div>
                    <div class="font-medium text-gray-900">#Hashtag{{ i }}</div>
                    <div class="text-sm text-gray-500">{{ 100 - (i * 20) }}k postingan</div>
                  </div>
                  <button class="text-gray-400 hover:text-gray-600">
                    <i class="fas fa-ellipsis-h"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </template>