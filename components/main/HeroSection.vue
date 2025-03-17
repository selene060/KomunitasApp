<template>
    <section class="pt-0 pb-16 overflow-hidden">
      <div class="container mx-auto px-4">
        <div class="relative"></div>
      </div>
      <div class="absolute inset-0">
        <div class="absolute right-0 top-20 w-96 h-96 bg-[#F9CDCC] opacity-5 rounded-full blur-3xl"></div>
        <div class="absolute -left-48 top-40 w-96 h-96 bg-[#F65035] opacity-5 rounded-full blur-3xl"></div>
      </div>
  
      <!--main content-->
      <div class="container relative mx-auto px-6 pt-10 pb-5">
        <div class="flex flex-col lg:flex-row items-center gap-16">
         
          <div class="flex-1 text-center lg:text-left" data-aos="fade-up">
            <div class="relative inline-block mb-4">
              <span class="px-4 py-2 text-sm font-medium text-[#3845AD] bg-[#F9CDCC]/20 rounded-lg">
                Platform Baru
              </span>
            </div>
            
            <h1 class="text-4xl lg:text-4xl font-bold text-[#3845AD] leading-tight mb-6">
              Home for your creativity 
            </h1>
            
            <p class="text-xl text-gray-600 mb-12 max-w-2xl mx-auto lg:mx-0">
              A Palette Full of Sparkling Ideas, Where Art Meets the Soul. 
              Connect your heart with others here.
            </p>
            
            <div class="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
              <NuxtLink 
                to="/login"
                class="group px-8 py-4 bg-[#F65035] text-white rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-[#F65035]/20"
              >
                <span class="relative flex items-center justify-center gap-2">
                  Login
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </NuxtLink>
              
              <nuxt-link 
              to="/superadmin/dashboard"
              class="group px-8 py-4 border-2 border-[#7FBFA2] text-[#7FBFA2] rounded-lg hover:bg-[#7FBFA2]/5 transition-all duration-300"
              >
                <span class="relative flex items-center justify-center gap-2">
                  Register
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  </svg>
                </span>
              </nuxt-link>
            
            </div>
            
            <div class="mt-16 grid grid-cols-3 gap-8">
              <div class="text-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                <div class="text-3xl font-bold text-[#3845AD] mb-2">10K+</div>
                <div class="text-gray-600 text-sm">Active Users</div>
              </div>
              <div class="text-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                <div class="text-3xl font-bold text-[#F65035] mb-2">50M+</div>
                <div class="text-gray-600 text-sm">Messages Sent</div>
              </div>
              <div class="text-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                <div class="text-3xl font-bold text-[#FFCD64] mb-2">99.9%</div>
                <div class="text-gray-600 text-sm">Uptime</div>
              </div>
            </div>
          </div>
  
          <div class="flex-1 relative" data-aos="fade-left" data-aos-delay="200">
            <div class="relative">
             
              <div class="absolute inset-0 border-2 border-[#F9CDCC]/20 rounded-lg transform rotate-3"></div>
              <NuxtImg
                src="/images/loooogoo.png"
                alt="App Interface"
                class="relative w-full max-w-2xl mx-auto rounded-lg shadow-lg transform transition-transform duration-500 hover:-translate-y-2"
              />
            </div>
            
           
            <div class="absolute -top-4 right-4 w-20 h-20 bg-[#FFCD64] opacity-10 rounded-lg"></div>
            <div class="absolute -bottom-4 left-4 w-20 h-20 bg-[#F9CDCC] opacity-10 rounded-lg"></div>
          </div>
        </div>
      </div>
    </section>
  </template>
  
  <script setup>
  onMounted(() => {
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 1000,
        easing: 'ease-out',
        once: true
      })
    }
  })
  </script>
  
  <style scoped>
  .shadow-sm {
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  }
  </style>
  