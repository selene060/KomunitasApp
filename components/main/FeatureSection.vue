<template>
    <section class="py-24 relative overflow-hidden">
      
      <div class="absolute inset-0 bg-[#F9CDCC]/10"></div>
      
      <div class="container mx-auto px-4 relative">
        <!-- header -->
        <div class="max-w-xl mx-auto text-center mb-20">
          <span class="inline-block w-12 h-12 rounded-full bg-[#F65035] mb-6 transform -rotate-12"></span>
          <h2 class="text-4xl font-bold text-[#3845AD] mb-4">Unleash Your Creativity</h2>
          <p class="text-gray-600">Tools that inspire, features that empower</p>
        </div>
  
        <div class="grid md:grid-cols-3 gap-12">
          <div v-for="(feature, index) in features" 
               :key="feature.title"
               class="group relative">
            <!-- card -->
            <div class="relative bg-white p-8 rounded-2xl shadow-lg transform group-hover:-translate-y-2 transition-transform duration-300 h-full">
              <!-- icon -->
              <div class="w-16 h-16 rounded-2xl bg-[#7FBFA2]/20 flex items-center justify-center mb-6 transform -rotate-6 group-hover:rotate-0 transition-transform">
                <span class="text-2xl">{{ feature.icon }}</span>
              </div>
              
              <h3 class="text-xl font-bold text-[#3845AD] mb-4">{{ feature.title }}</h3>
              <p class="text-gray-600">{{ feature.description }}</p>
              
              <!-- cta -->
              <div class="absolute bottom-0 left-0 w-0 h-1 group-hover:w-full transition-all duration-500"
                   :style="{ backgroundColor: feature.lineColor }"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </template>
  
  <script setup>
  const features = [
    {
      icon: '✨',
      title: 'Digital Artistry',
      description: 'Advanced tools that bring your creative vision to life with stunning precision and beauty.',
      lineColor: '#7FBFA2  ' 
    },
    {
      icon: '🎭',
      title: 'Creative Space',
      description: 'Your personal studio in the cloud, accessible anywhere, anytime.',
      lineColor: '#FFCD64 ' 
    },
    {
      icon: '🌟',
      title: 'Art Community',
      description: 'Connect with fellow artists, share insights, and grow together.',
      lineColor: '#F9CDCC ' 
    }
  ];
  </script>
  
  <style scoped>
  
  </style>
  