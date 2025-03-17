<!-- components/PostList.vue -->
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { usePostStore } from '~/stores/posts'
import PostCreate from './PostCreate.vue'
import type { Post, Media, Platform } from '~/types/post'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/vue'

// Component setup
const config = useRuntimeConfig()
const postStore = usePostStore()
const expandedPost = ref<number | null>(null)
const newComment = ref('')
const showMediaModal = ref(false)
const currentMedia = ref('')
const selectedPlatform = ref<Platform>('facebook')
const props = defineProps<{
  post: Post
}>()

const sharePlatforms = [
  { id: 'facebook', name: 'Facebook', icon: 'fab fa-facebook' },
  { id: 'twitter', name: 'Twitter', icon: 'fab fa-twitter' },
  { id: 'whatsapp', name: 'WhatsApp', icon: 'fab fa-whatsapp' },
  { id: 'telegram', name: 'Telegram', icon: 'fab fa-telegram' }
]
const showShareModal = ref(false)
// Create the getMediaUrl function (not inside methods)
const getMediaUrl = (url: string) => {
  if (url.startsWith('http')) {
    return url
  }
  return `${config.public.apiBase}${url}`
}

// Get posts on component mount
onMounted(async () => {
  await postStore.fetchPosts()
})

const posts = computed<Post[]>(() => postStore.posts)

const handleLike = async (postId: number) => {
  try {
    await postStore.interactWithPost(postId, 'like')
  } catch (error) {
    console.error('Failed to like post:', error)
  }
}

const handleShare = async (postId: number, platform: string) => {
  try {
    const postUrl = `${window.location.origin}/posts/${postId}`
    
    // Handle different sharing platforms
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`)
        break
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}`)
        break
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(postUrl)}`)
        break
      case 'telegram':
        window.open(`https://t.me/share/url?url=${encodeURIComponent(postUrl)}`)
        break
    }
    
    // Record share interaction
    await postStore.interactWithPost(postId, 'share', {
      platform,
      shared_url: postUrl
    })
    
    showShareModal.value = false
  } catch (error) {
    console.error('Failed to share post:', error)
  }
}

const copyPostLink = async (postId: number) => {
  const postUrl = `${window.location.origin}/posts/${postId}`
  await navigator.clipboard.writeText(postUrl)
  
  // Record share interaction
  await postStore.interactWithPost(postId, 'share', {
    platform: 'copy',
    shared_url: postUrl
  })
  
  showShareModal.value = false
}

const toggleComments = async (postId: number) => {
  if (expandedPost.value === postId) {
    expandedPost.value = null
  } else {
    expandedPost.value = postId
    // Fetch comments when expanding
    try {
      await postStore.fetchComments(postId)
    } catch (error) {
      console.error('Failed to fetch comments:', error)
    }
  }
}

const handleComment = async (postId: number) => {
  if (!newComment.value.trim()) return
  
  try {
    await postStore.createComment(postId, newComment.value)
    newComment.value = ''
  } catch (error) {
    console.error('Failed to create comment:', error)
  }
}

const openMediaModal = (media: Media[], index: number) => {
  currentMedia.value = getMediaUrl(media[index].url)  // Use getMediaUrl here
  showMediaModal.value = true
}

const closeMediaModal = () => {
  showMediaModal.value = false
  currentMedia.value = ''
}
</script>
<template>
  <div class="space-y-6">
    <PostCreate />
    
    <div v-for="post in posts"
      :key="post.post_id"
      class="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div class="p-6">
        <!-- Post Header -->
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div>
              <div class="flex items-center space-x-2">
                <span class="font-semibold">{{ post.username }}</span>
                <span class="text-gray-500">@username</span>
              </div>
              <p class="text-sm text-gray-500">
                {{ new Date(post.created_at).toLocaleDateString() }}
              </p>
            </div>
          </div>
          <button class="text-gray-400 hover:text-gray-600">
            <i class="fas fa-ellipsis-h"></i>
          </button>
        </div>

        <!-- Post Content -->
        <p class="text-gray-900 mb-4">{{ post.caption }}</p>

        <!-- Post Media -->
        <div v-if="post.media?.length" class="mb-4">
          <div class="grid grid-cols-2 gap-3">
            <div v-for="(media, index) in post.media" 
              :key="index" 
              class="relative rounded-xl overflow-hidden">
              <img v-if="media.type === 'image'"
                :src="getMediaUrl(media.url)"
                class="w-full h-48 object-cover cursor-pointer"
                @click="openMediaModal(post.media, index)"
                alt="Post media"
              />
              <video v-else
                :src="getMediaUrl(media.url)"
                class="w-full h-48 object-cover"
                controls
              ></video>
            </div>
          </div>
        </div>

        <!-- Interaction Stats -->
        <div class="flex items-center justify-between pt-4 border-t">
          <div class="flex space-x-6">
            <button @click="handleLike(post.post_id)"
              class="flex items-center space-x-2 group">
              <div class="p-2 rounded-full group-hover:bg-red-50 transition-colors">
                <i class="fas fa-heart" :class="{
                  'text-red-500': post.is_liked,
                  'text-gray-400 group-hover:text-red-500': !post.is_liked
                }"></i>
              </div>
              <span class="text-gray-600">{{ post.like_count }}</span>
            </button>
            
            <button @click="toggleComments(post.post_id)"
              class="flex items-center space-x-2 group">
              <div class="p-2 rounded-full group-hover:bg-blue-50 transition-colors">
                <i class="fas fa-comment text-gray-400 group-hover:text-blue-500"></i>
              </div>
              <span class="text-gray-600">{{ post.comment_count }}</span>
            </button>

            <button @click="showShareModal = true"
              class="flex items-center space-x-2 group">
              <div class="p-2 rounded-full group-hover:bg-green-50 transition-colors">
                <i class="fas fa-share text-gray-400 group-hover:text-green-500"></i>
              </div>
              <span class="text-gray-600">{{ post.share_count }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Comments Section -->
      <div v-if="expandedPost === post.post_id" class="bg-gray-50 px-6 py-4">
        <form @submit.prevent="handleComment(post.post_id)" class="mb-4">
          <div class="flex space-x-3">
            <div class="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0"></div>
            <div class="flex-1">
              <input v-model="newComment"
                type="text"
                placeholder="Write a comment..."
                class="w-full px-4 py-2 bg-white rounded-full border focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>
        </form>

        <div v-if="post.comments?.length" class="space-y-4">
          <div v-for="comment in post.comments"
            :key="comment.comment_id"
            class="flex space-x-3">
            <div class="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0"></div>
            <div>
              <span class="font-medium">{{ comment.username }}</span>
              <p class="text-gray-700">{{ comment.comment }}</p>
              <p class="text-xs text-gray-500 mt-1">
                {{ new Date(comment.created_at).toLocaleDateString() }}
              </p>
            </div>
          </div>
        </div>
        <div v-else class="text-center text-gray-500 py-4">
          No comments yet
        </div>
      </div>
    </div>
  </div>

  <!-- Share Modal -->
  <Dialog v-model:open="showShareModal" class="relative z-50">
    <div class="fixed inset-0 bg-black/30" aria-hidden="true" />
    <div class="fixed inset-0 flex items-center justify-center p-4">
      <DialogPanel class="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <DialogTitle class="text-lg font-medium mb-4">Share Post</DialogTitle>
        
        <div class="grid grid-cols-2 gap-3">
          <!-- Social Media Sharing -->
          <button v-for="platform in sharePlatforms"
            :key="platform.id"
            @click="handleShare(post.post_id, platform.id)"
            class="flex items-center space-x-2 p-3 rounded-xl border hover:bg-gray-50 transition-colors">
            <i :class="platform.icon"></i>
            <span>{{ platform.name }}</span>
          </button>
          
          <!-- Copy Link -->
          <button @click="copyPostLink(post.post_id)"
            class="flex items-center space-x-2 p-3 rounded-xl border hover:bg-gray-50 transition-colors">
            <i class="fas fa-link"></i>
            <span>Copy Link</span>
          </button>
        </div>
      </DialogPanel>
    </div>
  </Dialog>

  <!-- Media Modal -->
  <div v-if="showMediaModal"
    class="fixed inset-0 bg-black/75 flex items-center justify-center z-50"
    @click="closeMediaModal">
    <div class="max-w-4xl w-full p-4">
      <img :src="currentMedia" class="max-h-[90vh] w-auto rounded-xl" alt="Media preview" />
      <button @click="closeMediaModal"
        class="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/75 transition-colors">
        <i class="fas fa-times"></i>
      </button>
    </div>
  </div>
</template>