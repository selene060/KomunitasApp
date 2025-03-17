<template>
  <div class="fixed left-0 top-0 h-screen w-16 bg-white shadow-md flex flex-col items-center py-4">
    <div class="flex flex-col items-center gap-4 flex-grow justify-center">
      <button 
        v-for="(icon, index) in icons" 
        :key="index" 
        @click="handleIconClick(icon, index)"
        class="w-12 h-12 flex items-center justify-center rounded-lg transition-all duration-200 group relative"
        :class="{ 
          'bg-orange-100 text-orange-500': activeIndex === index,
          'text-gray-500 hover:bg-orange-50 hover:text-orange-400': activeIndex !== index
        }"
      >
        <svg class="w-6 h-6 transition-transform group-hover:scale-110" :viewBox="icon.viewBox" fill="currentColor">
          <path :d="icon.d" />
        </svg>
      </button>
    </div>

    <!-- Tombol Profile di bagian bawah -->
    <div class="pb-4">
      <button 
        @click="handleIconClick(profileIcon, icons.length)" 
        class="w-12 h-12 flex items-center justify-center rounded-lg transition-all duration-200 group"
        :class="{ 
          'bg-orange-100 text-orange-500': activeIndex === icons.length,
          'text-gray-500 hover:bg-orange-50 hover:text-orange-500': activeIndex !== icons.length
        }"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          class="w-6 h-6 transition-transform group-hover:scale-110" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          stroke-width="2" 
          stroke-linecap="round" 
          stroke-linejoin="round"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      </button>
    </div>

    <PostModal 
      v-if="showPostModal" 
      @close="showPostModal = false"
      @post-created="handlePostCreation"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import PostModal from '~/components/userpost/PostModal.vue'

const router = useRouter()
const activeIndex = ref(0)
const showPostModal = ref(false)

const icons = [
  { route: "/user/dashboard", viewBox: "0 0 24 24", d: "M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z", tooltip: "Home" }, 
  { route: "/user/communities", viewBox: "0 0 24 24", d: "M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z", tooltip: "Communities" }, 
  { route: "#", viewBox: "0 0 24 24", d: "M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z", tooltip: "Create Post" }, 
  // { route: "/user/posts_baru", viewBox: "0 0 24 24", d: "M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z", tooltip: "Create Post" }, 
  { route: "/user/notif", viewBox: "0 0 24 24", d: "M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6zm-4 5", tooltip: "Notifications" }, 
  { route: "/user/chat", viewBox: "0 0 24 24", d: "M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z", tooltip: "Messages" }
]

const profileIcon = {
  route: "/user/profile",
  viewBox: "0 0 24 24",
  d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 7a4 4 0 1 1 8 0 4 4 0 1 1-8 0",
  tooltip: "Profile"
}

const handleIconClick = (icon, index) => {
  activeIndex.value = index
  if (icon.route === '#') {
    showPostModal.value = true
  } else {
    router.push(icon.route)
  }
}

const handlePostCreation = () => {
  showPostModal.value = false
}
</script>
