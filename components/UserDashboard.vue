<template>
  <div class="for-you-container">
    <h2 class="text-xl font-semibold mb-4 text-gray-800">For You</h2>
    
    <!-- Filter Controls -->
    <div class="mb-4 flex items-center space-x-2">
      <button 
        @click="activeFilter = 'all'"
        :class="`px-4 py-2 rounded-md ${activeFilter === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`"
      >
        All Posts
      </button>
      <button 
        @click="activeFilter = 'public'"
        :class="`px-4 py-2 rounded-md ${activeFilter === 'public' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`"
      >
        Public
      </button>
      <button 
        @click="activeFilter = 'private'"
        :class="`px-4 py-2 rounded-md ${activeFilter === 'private' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`"
      >
        Private
      </button>
    </div>
    
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-10">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
    </div>
    
    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 text-red-600 p-4 rounded-lg">
      {{ error }}
      <button @click="fetchPosts" class="text-indigo-600 underline ml-2">Retry</button>
    </div>
    
    <!-- Empty State -->
    <div v-else-if="filteredPosts.length === 0" class="bg-gray-50 p-6 rounded-lg text-center">
      <div class="mb-3 text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="mx-auto">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
      </div>
      <p class="text-gray-600 mb-2">No {{ activeFilter === 'all' ? '' : activeFilter }} posts found</p>
      <p class="text-gray-500 text-sm">Be the first to share something with the community!</p>
    </div>
    
    <!-- Posts -->
    <div v-else class="space-y-4">
      <div v-for="post in filteredPosts" :key="post.post_id" class="bg-white rounded-lg p-4 shadow-sm">
        <div class="flex items-start justify-between mb-2">
          <div class="w-full">
            <div class="flex items-center">
              <div class="w-10 h-10 rounded-full bg-[#e4e6eb] flex items-center justify-center overflow-hidden">
                <!-- Avatar placeholder or user profile image
                <svg v-if="!post.avatar" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <img v-else :src="post.avatar" alt="User avatar" class="w-full h-full object-cover" /> -->
              </div>
              
              <div class="ml-3">
                <p class="font-medium text-gray-800">{{ post.username }}</p>
                <div class="flex items-center text-xs text-gray-500">
                  <span>{{ formatDate(post.created_at) }}</span>
                  <span class="mx-1">•</span>
                  <span class="flex items-center">
                    <svg 
                      v-if="post.privacy === 'public'"
                      xmlns="http://www.w3.org/2000/svg" 
                      width="12" 
                      height="12" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      stroke-width="2" 
                      stroke-linecap="round" 
                      stroke-linejoin="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    <svg 
                      v-else
                      xmlns="http://www.w3.org/2000/svg" 
                      width="12" 
                      height="12" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      stroke-width="2" 
                      stroke-linecap="round" 
                      stroke-linejoin="round"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                    <span class="ml-1">{{ post.privacy === 'public' ? 'Public' : 'Private' }}</span>
                  </span>
                </div>
              </div>
            </div>
            
            <p class="mt-2 text-gray-700 whitespace-pre-line">{{ post.caption }}</p>
            
            <!-- Media -->
            <div class="mt-3">
              <!-- Default media placeholder if no media exists -->
              <div v-if="!post.media || post.media.length === 0" class="rounded-lg overflow-hidden bg-gray-100 h-48 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
              </div>
              
              <!-- If media exists, display it -->
              <div v-else class="grid" :class="getMediaGridClass(post.media)">
                <div v-for="(media, mediaIndex) in post.media" :key="mediaIndex" class="w-full h-full overflow-hidden rounded-lg">
                  <img v-if="media.type === 'image'" :src="media.url" class="w-full h-full object-cover" />
                  <video v-else-if="media.type === 'video'" controls class="w-full h-full object-cover">
                    <source :src="media.url" :type="`video/${getVideoExtension(media.url)}`">
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            </div>
            
            <!-- Post Stats -->
            <div class="mt-3 flex justify-between items-center text-gray-500 text-sm">
              <div class="flex space-x-4">
                <button @click="handleLike(post)" class="flex items-center space-x-1 hover:text-indigo-600">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    :stroke="post.is_liked ? '#4f46e5' : 'currentColor'"
                    :fill="post.is_liked ? '#4f46e5' : 'none'"
                    stroke-width="2" 
                    stroke-linecap="round" 
                    stroke-linejoin="round"
                    :class="post.is_liked ? 'text-indigo-600' : ''"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                  <span>{{ post.like_count }}</span>
                </button>
                <button class="flex items-center space-x-1 hover:text-indigo-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                  </svg>
                  <span>{{ post.comment_count }}</span>
                </button>
              </div>
              <button @click="handleShare(post)" class="flex items-center hover:text-indigo-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="18" cy="5" r="3"></circle>
                  <circle cx="6" cy="12" r="3"></circle>
                  <circle cx="18" cy="19" r="3"></circle>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                </svg>
                <span class="ml-1">Share</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { usePostStore } from '~/stores/posts';
import type { Post } from '~/types/post';

// Store
const postStore = usePostStore();

// State
const activeFilter = ref('all');
const loading = computed(() => postStore.loading);
const error = computed(() => postStore.error);
const posts = computed(() => postStore.posts);

// Filtered posts based on active filter
const filteredPosts = computed(() => {
  if (activeFilter.value === 'all') {
    return posts.value;
  } else {
    return posts.value.filter(post => post.privacy === activeFilter.value);
  }
});

// Format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

// Get media grid class based on number of media items
const getMediaGridClass = (media: any[]) => {
  switch (media.length) {
    case 1:
      return 'grid-cols-1';
    case 2:
      return 'grid-cols-2 gap-1';
    case 3:
      return 'grid-cols-2 gap-1';
    case 4:
      return 'grid-cols-2 gap-1';
    default:
      return 'grid-cols-1';
  }
};

// Extract video extension from URL
const getVideoExtension = (url: string) => {
  const parts = url.split('.');
  return parts[parts.length - 1];
};

// Handle like button click
const handleLike = async (post: Post) => {
  try {
    await postStore.interactWithPost(post.post_id, 'like');
  } catch (error) {
    console.error('Failed to like post:', error);
  }
};

// Handle share button click
const handleShare = async (post: Post) => {
  try {
    // You can implement a share dialog here
    // For now, let's just call the share interaction
    await postStore.interactWithPost(post.post_id, 'share', {
      platform: 'internal'
    });
  } catch (error) {
    console.error('Failed to share post:', error);
  }
};

// Fetch posts on component mount
const fetchPosts = async () => {
  try {
    await postStore.fetchPosts();
  } catch (error) {
    console.error('Failed to fetch posts:', error);
  }
};

onMounted(() => {
  fetchPosts();
});

// Watch for filter changes to update UI
watch(activeFilter, (newFilter) => {
  console.log(`Filter changed to: ${newFilter}`);
});
</script>