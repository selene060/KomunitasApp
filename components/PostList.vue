<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { usePostStore } from '~/stores/posts'
import PostCreate from './PostCreate.vue'
import type { Post, Media, Platform } from '~/types/post'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/vue'
import { useAuthStore } from '~/stores/auth'

// Component setup
const config = useRuntimeConfig()
const authStore = useAuthStore()
const expandedPost = ref<number | null>(null)
const newComment = ref('')
const showMediaModal = ref(false)
const currentMedia = ref('')
const showDocumentModal = ref(false)
const showDocumentPreviewModal = ref(false)
const showDeleteConfirmModal = ref(false)
const postToDelete = ref<number | null>(null)
const activeDropdown = ref<number | null>(null)
const showDeleteModal = ref(false)
const showReportModal = ref(false)
const selectedPostId = ref<number | null>(null)
const reportReason = ref('')

const props = defineProps<{
  post: {
    post_id: number
    like_count: number
    is_liked: boolean
  }
}>()

const postStore = usePostStore()
const isLoading = ref(false)
const toggleDropdown = (postId: number) => {
  if (activeDropdown.value === postId) {
    activeDropdown.value = null
  } else {
    activeDropdown.value = postId
  }
}

const closeDropdown = () => {
  activeDropdown.value = null
}



const openDeleteModal = (postId: number) => {
  postToDelete.value = postId  // Use postToDelete instead of selectedPostId
  showDeleteModal.value = true
  closeDropdown()
}

const openReportModal = (postId: number) => {
  selectedPostId.value = postId
  showReportModal.value = true
  closeDropdown()
}


const submitReport = async () => {
  try {
    if (!reportReason.value.trim()) {
      alert('Please provide a reason for reporting')
      return
    }
    
    await postStore.reportContent(selectedPostId.value as number, reportReason.value)
    showReportModal.value = false
    reportReason.value = ''
    // Optional: show success message
  } catch (error) {
    console.error('Error reporting post:', error)
    // Optional: show error message
  }
}


const currentDocument = ref<{
  url: string, 
  name: string, 
  size: string
}>({
  url: '',
  name: '',
  size: ''
})

const openDocumentPreviewOptions = (media: Media) => {
  currentDocument.value = {
    url: getMediaUrl(media.url),
    name: extractFileName(media.url),
    size: 'Calculating...' // Ideally, fetch actual file size from backend
  }
  showDocumentPreviewModal.value = true
}

const openDocumentInNewTab = (url: string) => {
  window.open(url, '_blank')
  showDocumentPreviewModal.value = false
}

const openDocumentInBrowser = (url: string) => {
  window.location.href = url
  showDocumentPreviewModal.value = false
}

const downloadDocument = (document: { url: string, name: string }) => {
  const link = window.document.createElement('a')
  link.href = document.url
  link.download = document.name || extractFileName(document.url)
  
  // Append to body, click, and remove
  window.document.body.appendChild(link)
  link.click()
  window.document.body.removeChild(link)
  
  // Close the modal
  showDocumentPreviewModal.value = false
}

// Utility functions for document handling
const extractFileName = (url: string) => {
  return url.split('/').pop() || 'Unknown Document'
}

const getFileExtension = (url: string) => {
  return url.split('.').pop() || ''
}

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const openDocumentModal = (media: Media) => {
  // You'll need to implement a backend endpoint to get file size
  currentDocument.value = {
    url: getMediaUrl(media.url),
    name: extractFileName(media.url),
    size: 'Calculating...' // Ideally, fetch actual file size from backend
  }
  showDocumentModal.value = true
}

const selectedPlatform = ref<Platform>('facebook')


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
  return ${config.public.apiBase}${url}
}

// Get posts on component mount
onMounted(async () => {
  const authStore = useAuthStore()
  console.log('Initial auth state:', authStore.initialized, authStore.isAuthenticated)
  
  try {
    if (!authStore.initialized) {
      console.log('Menginisialisasi auth...')
      await authStore.initAuth()
      console.log('Auth setelah inisialisasi:', authStore.isAuthenticated, 'Token ada:', !!authStore.accessToken)
    }
    
    if (authStore.isAuthenticated) {
      console.log('Mengambil data posts...')
      await postStore.fetchPosts()
      console.log('Jumlah posts yang diambil:', postStore.posts.length)
    } else {
      console.error('Tidak terautentikasi setelah inisialisasi')
    }
  } catch (error) {
    console.error('Error:', error)
  }
})

const posts = computed<Post[]>(() => postStore.posts)

// Check if the current user is the owner of the post
const isPostOwner = (post: Post) => {
  return post.user_id === authStore.user?.id
}

const handleLike = async (postId: number) => {
  if (isLoading.value) return
  
  isLoading.value = true
  try {
    await postStore.interactWithPost(postId, 'like')
  } catch (error) {
    console.error('Failed to like post:', error)
  } finally {
    isLoading.value = false
  }
}


const deletePost = async () => {
   try {
     if (postToDelete.value) {
       await postStore.deletePost(postToDelete.value)
       console.log('Post deleted successfully')
       // Update the posts list
       await postStore.fetchPosts()
     }
   } catch (error) {
     console.error('Failed to delete post:', error)
   } finally {
     showDeleteModal.value = false  // Use showDeleteModal instead of showDeleteConfirmModal
     postToDelete.value = null
   }
}

const handleShare = async (postId: number, platform: string) => {
  try {
    const postUrl = ${window.location.origin}/posts/${postId}
    
    // Handle different sharing platforms
    switch (platform) {
      case 'facebook':
        window.open(https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)})
        break
      case 'twitter':
        window.open(https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)})
        break
      case 'whatsapp':
        window.open(https://wa.me/?text=${encodeURIComponent(postUrl)})
        break
      case 'telegram':
        window.open(https://t.me/share/url?url=${encodeURIComponent(postUrl)})
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
  try {
    // Make sure we're using the correct postId passed to the function
    const postUrl = ${window.location.origin}/posts/${postId}
    console.log(Copying link for post ID: ${postId})
    
    // First try to copy to clipboard
    await navigator.clipboard.writeText(postUrl)
    console.log(Link copied to clipboard: ${postUrl})
    
    // Then record share interaction - using the correct postId
    try {
      const response = await postStore.interactWithPost(postId, 'share', {
        platform: 'copy',
        shared_url: postUrl
      })
      console.log(Share recorded successfully for post ID ${postId}:, response)
    } catch (apiError) {
      console.error(API error while recording share for post ID ${postId}:, apiError)
    }
    
    // toast.success('Link copied to clipboard!')
  } catch (error) {
    console.error('Failed to copy link:', error)
    // toast.error('Failed to copy link')
  } finally {
    showShareModal.value = false
  }
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
    <!-- Create Post Component -->
    <PostCreate />
    <!-- Posts List -->
    <div
      v-for="post in posts"
      :key="post.post_id"
      class="bg-white rounded-lg shadow p-4"
    >
      <!-- Post Header -->
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center">
          <div class="ml-3">
            <p class="font-medium">{{ post.username }}</p>
            <p class="text-sm text-gray-500">
              {{ new Date(post.created_at).toLocaleDateString() }}
            </p>
          </div>
        </div>
        
        <!-- Three dots menu for post owner -->
        <!-- Three dots menu for all users -->
        <div class="relative">
          <div class="relative inline-block text-left">
            <button
              type="button"
              class="p-2 rounded-full hover:bg-gray-100 text-gray-700"
              @click.stop="toggleDropdown(post.post_id)"
            >
              <i class="fas fa-ellipsis-h"></i>
            </button>
            <!-- Dropdown menu -->
            <div 
              v-if="activeDropdown === post.post_id" 
              class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
            >
              <div class="py-1">
                <!-- Delete option (only for post owner) -->
                <a 
                  v-if="isPostOwner(post)" 
                  href="#" 
                  class="block px-4 py-2 text-sm text-red-700 hover:bg-gray-100"
                  @click.prevent.stop="openDeleteModal(post.post_id)"
                >
                  <i class="fas fa-trash mr-2"></i> Delete
                </a>
                <!-- Report option (for all users) -->
                <a 
                  href="#" 
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  @click.prevent.stop="openReportModal(post.post_id)"
                >
                  <i class="fas fa-flag mr-2"></i> Report
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Post Caption -->
      <p class="mb-4">{{ post.caption }}</p>

      <!-- Post Media -->
      <div v-if="post.media && post.media.length" class="mb-4">
        <div class="grid grid-cols-2 gap-4">
          <div v-for="(media, index) in post.media" :key="index" class="relative">
            <!-- Image -->
            <img
              v-if="media.type === 'image'"
              :src="getMediaUrl(media.url)"
              class="w-full h-48 object-cover rounded-lg"
              @click="openMediaModal(post.media, index)"
              alt="Post media"
            />
            <!-- Video -->
            <video
              v-else-if="media.type === 'video'"
              :src="getMediaUrl(media.url)"
              class="w-full h-48 object-cover rounded-lg"
              controls
            ></video>
            <!-- Document -->
            <div 
              v-else-if="media.type === 'document'"
              @click.stop="openDocumentPreviewOptions(media)"
              class="bg-gray-100 p-4 rounded-lg flex items-center justify-between cursor-pointer hover:bg-gray-200"
            >
              <div class="flex items-center space-x-2">
                <i class="fas fa-file-alt text-2xl text-gray-600"></i>
                <div>
                  <p class="font-medium truncate max-w-[200px]">
                    {{ extractFileName(media.url) }}
                  </p>
                  <p class="text-sm text-gray-500">
                    {{ getFileExtension(media.url).toUpperCase() }} Document
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Post Interactions -->
      <div class="flex items-center justify-between mb-4">
        <div class="flex space-x-4">
          <button
  @click="handleLike(post.post_id)"
  class="flex items-center space-x-2 transition-colors duration-200 px-3 py-1 rounded-md"
  :class="{
    'text-blue-500 bg-blue-50 hover:bg-blue-100': post.is_liked,
    'text-gray-600 hover:bg-gray-100': !post.is_liked
  }"
  :disabled="isLoading"
>
  <i 
    class="fas fa-thumbs-up" 
    :class="{
      'text-blue-500': post.is_liked,
      'text-gray-600': !post.is_liked
    }"
  ></i>
  <span 
    :class="{
      'text-blue-500': post.is_liked,
      'text-gray-600': !post.is_liked
    }"
  >{{ post.like_count }}</span>
</button>
          
          <button
            @click="showShareModal = true"
            class="flex items-center space-x-2 text-gray-600 hover:bg-gray-100 transition-colors duration-200 px-3 py-1 rounded-md"
          >
            <i class="fas fa-share"></i>
            <span>{{ post.share_count }}</span>
          </button>
        </div>

        <button
          @click="toggleComments(post.post_id)"
          class="flex items-center space-x-2 text-gray-600 hover:bg-gray-100 transition-colors duration-200 px-3 py-1 rounded-md"
        >
          <i class="fas fa-comment"></i>
          <span>{{ post.comment_count }}</span>
        </button>

        <!-- Share Modal -->
        <Dialog v-model:open="showShareModal" class="relative z-50">
          <div class="fixed inset-0 bg-black/30" aria-hidden="true" />
          <div class="fixed inset-0 flex items-center justify-center p-4">
            <DialogPanel class="w-full max-w-md rounded bg-white p-6 shadow-xl">
              <DialogTitle class="text-lg font-medium mb-4">Share Post</DialogTitle>
              
              <div class="grid grid-cols-2 gap-4">
                <!-- Social Media Sharing -->
                <button
                  v-for="platform in sharePlatforms"
                  :key="platform.id"
                  @click="handleShare(post.post_id, platform.id)"
                  class="flex items-center space-x-2 p-3 rounded-lg border hover:bg-gray-50"
                >
                  <i :class="platform.icon"></i>
                  <span>{{ platform.name }}</span>
                </button>
                
                <!-- Copy Link -->
                <button
  @click="copyPostLink(post.post_id)"
  class="flex items-center space-x-2 p-3 rounded-lg border hover:bg-gray-50"
>
  <i class="fas fa-link"></i>
  <span>Copy Link</span>
</button>
              </div>
            </DialogPanel>
          </div>
        </Dialog>
      </div>
      <!-- Comments Section -->
      <div v-if="expandedPost === post.post_id">
        <div class="border-t pt-4">
          <!-- Comment Form -->
          <form @submit.prevent="handleComment(post.post_id)" class="mb-4">
            <div class="flex space-x-2">
              <input
                v-model="newComment"
                type="text"
                placeholder="Write a comment..."
                class="flex-1 p-2 border rounded-lg"
              />
              <button
                type="submit"
                class="px-4 py-2 bg-blue-500 text-white rounded-lg"
              >
                Post
              </button>
            </div>
          </form>

          <!-- Comments List -->
          <div v-if="post.comments?.length" class="space-y-4">
            <div
              v-for="comment in post.comments"
              :key="comment.comment_id"
              class="flex space-x-2"
            >
              <div>
                <p class="font-medium">{{ comment.username }}</p>
                <p class="text-sm">{{ comment.comment }}</p>
                <p class="text-xs text-gray-500">
                  {{ new Date(comment.created_at).toLocaleDateString() }}
                </p>
              </div>
            </div>
          </div>
          <div v-else class="text-gray-500 text-center py-4">
            No comments yet
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Delete Confirmation Modal -->
  <!-- Delete Confirmation Modal -->
<div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
  <div class="bg-white rounded-lg p-6 w-96">
    <h3 class="text-lg font-medium mb-4">Delete Post</h3>
    <p class="mb-4">Are you sure you want to delete this post? This action cannot be undone.</p>
    <div class="flex justify-end gap-2">
      <button 
        @click="showDeleteModal = false" 
        class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md"
      >
        Cancel
      </button>
      <button 
        @click="deletePost" 
        class="px-4 py-2 bg-red-600 text-white rounded-md"
      >
        Delete
      </button>
    </div>
  </div>
</div>

<!-- Report Modal -->
<div v-if="showReportModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
  <div class="bg-white rounded-lg p-6 w-96">
    <h3 class="text-lg font-medium mb-4">Report Post</h3>
    <textarea 
      v-model="reportReason" 
      class="w-full p-2 border rounded-md mb-4"
      rows="4"
      placeholder="Please explain why you're reporting this post"
    ></textarea>
    <div class="flex justify-end gap-2">
      <button 
        @click="showReportModal = false" 
        class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md"
      >
        Cancel
      </button>
      <button 
        @click="submitReport" 
        class="px-4 py-2 bg-blue-600 text-white rounded-md"
      >
        Submit Report
      </button>
    </div>
  </div>
</div>

  <!-- Document Preview Modal -->
  <Dialog v-model:open="showDocumentPreviewModal" class="relative z-50">
    <div class="fixed inset-0 bg-black/30" aria-hidden="true" />
    <div class="fixed inset-0 flex items-center justify-center p-4">
      <DialogPanel class="w-full max-w-md rounded bg-white p-6 shadow-xl">
        <DialogTitle class="text-lg font-medium mb-4">Open Document</DialogTitle>
        
        <div class="space-y-4">
          <button 
            @click="openDocumentInNewTab(currentDocument.url)"
            class="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center space-x-2"
          >
            <i class="fas fa-external-link-alt"></i>
            <span>Open in New Tab</span>
          </button>
        
          <button 
            @click="downloadDocument(currentDocument)"
            class="w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center justify-center space-x-2"
          >
            <i class="fas fa-download"></i>
            <span>Download</span>
          </button>
          
          <button 
            @click="showDocumentPreviewModal = false"
            class="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </DialogPanel>
    </div>
  </Dialog>
  
  <!-- Media Modal -->
  <div
    v-if="showMediaModal"
    class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
    @click="closeMediaModal"
  >
    <div class="max-w-4xl w-full p-4">
      <img :src="currentMedia" class="max-h-[90vh] w-auto" alt="Media preview" />
        <button 
          @click="closeMediaModal"
          class="absolute top-4 right-4 text-white text-xl"
        >
          ×
        </button>
    </div>
  </div>
</template>