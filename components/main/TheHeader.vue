<template>
    <header class="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50">
      <nav class="container mx-auto px-6 py-4 flex justify-between items-center">
        <div class="flex items-center gap-2">
          <NuxtImg src="/images/logobadut.png" alt="Artefy Logo" class="w-10 h-10" />
          <span class="font-bold text-xl text-purple-900">Artefy</span>
        </div>
        <div class="hidden md:flex items-center gap-12 ml-auto">
            <a v-for="item in navItems" 
               :key="item" 
               href="#" 
               class="relative group">
              <span class="text-gray-700 font-medium z-10 relative">{{ item }}</span>
              <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FFCD64] group-hover:w-full transition-all duration-300"></span>
            </a>
          </div>
      </nav>
    </header>
  </template>
  
  <script setup>
  const navItems = ['Gallery', 'Studio', 'Community', 'Learn'];
  </script>
  