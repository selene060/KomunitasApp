<template>
    <footer class="bg-[#F9CDCC]/10 py-16">
      <div class="container mx-auto px-6">
        <!-- logo -->
        <div class="flex items-center gap-2 mb-12">
          <NuxtImg src="/images/logobadut.png" alt="Artefy Logo" class="w-10 h-10" />
          <span class="font-bold text-xl text-[#3845AD]">Artefy</span>
        </div>
  
        <div class="grid md:grid-cols-4 gap-12">
        
          <div>
            <h4 class="font-bold text-[#F65035] mb-4">Making Art Beautiful</h4>
            <p class="text-gray-600 mb-6">Connect your creativity with the world through our innovative platform.</p>
            
            <div class="flex gap-4">
              <a href="#" class="text-[#7FBFA2] hover:text-[#7FBFA2]/80 transition-colors">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" class="text-[#7FBFA2] hover:text-[#7FBFA2]/80 transition-colors">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="#" class="text-[#7FBFA2] hover:text-[#7FBFA2]/80 transition-colors">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.016 18.6h-2.472v-3.9c0-.918-.018-2.1-1.278-2.1-1.28 0-1.476 1.002-1.476 2.04v3.96H9.318V9.6h2.376v1.086h.036c.33-.624 1.134-1.284 2.334-1.284 2.496 0 2.952 1.644 2.952 3.78v5.418zM7.728 8.514c-.792 0-1.44-.648-1.44-1.446 0-.798.648-1.446 1.44-1.446s1.44.648 1.44 1.446c0 .798-.648 1.446-1.44 1.446zM6.492 18.6h2.472V9.6H6.492v9z"/>
                </svg>
              </a>
            </div>
          </div>
  
        
          <div v-for="(links, category) in footerLinks" :key="category">
            <h4 class="font-bold text-[#3845AD] mb-4">{{ category }}</h4>
            <ul class="space-y-3">
              <li v-for="link in links" :key="link">
                <NuxtLink
                  :to="link.toLowerCase()"
                  class="text-gray-600 hover:text-[#F65035] transition-colors"
                >
                  {{ link }}
                </NuxtLink>
              </li>
            </ul>
          </div>
        </div>
  
   
        <div class="mt-12 pt-8 border-t border-[#F9CDCC]">
          <div class="flex flex-col md:flex-row justify-between items-center gap-4">
            <p class="text-gray-600 text-sm">© 2024 Artefy. All rights reserved.</p>
            <div class="flex gap-6">
              <a href="#" class="text-gray-600 hover:text-[#F65035] text-sm">Privacy Policy</a>
              <a href="#" class="text-gray-600 hover:text-[#F65035] text-sm">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </template>
  
  <script setup>
  const footerLinks = ref({
    'Platform': ['Features', 'Security', 'Pricing', 'API'],
    'Company': ['About', 'Careers', 'Contact', 'Blog'],
    'Resources': ['Documentation', 'Help Center', 'Community', 'Status']
  })
  </script>
  