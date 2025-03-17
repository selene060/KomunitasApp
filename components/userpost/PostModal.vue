<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="bg-white rounded-lg w-[500px] p-6 relative shadow-lg border border-gray-200">
      <!-- Close Button -->
      <button 
        @click="$emit('close')" 
        class="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      <h2 class="text-xl font-semibold mb-4 text-center text-gray-800">Create a Post</h2>

      <!-- Error Message -->
      <div v-if="errorMessage" class="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-4">
        {{ errorMessage }}
      </div>

      <!-- Post Content Textarea -->
      <div class="relative mb-4">
        <textarea 
          v-model="postContent" 
          placeholder="What's on your mind?"
          class="w-full h-40 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700"
          @input="handleContentInput"
        ></textarea>
        
        <!-- Hashtag Suggestions -->
        <div v-if="showHashtagSuggestions && hashtagSuggestions.length > 0" class="absolute bottom-0 left-0 transform translate-y-full bg-white w-full border border-gray-200 rounded-lg shadow-lg z-10 max-h-40 overflow-y-auto">
          <div v-for="suggestion in hashtagSuggestions" :key="suggestion.hashtag_id" @click="selectHashtag(suggestion)" class="p-2 hover:bg-gray-100 cursor-pointer">
            #{{ suggestion.name }} ({{ suggestion.usage_count }})
          </div>
        </div>
      </div>

      <!-- Media Preview -->
      <div v-if="mediaFiles.length" class="grid grid-cols-4 gap-2 mb-4">
        <div v-for="(file, index) in mediaFiles" :key="index" class="relative">
          <img 
            :src="getMediaPreview(file)" 
            class="w-full h-20 object-cover rounded-lg"
          />
          <button 
            @click="removeMedia(index)"
            class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
          >
            &times;
          </button>
        </div>
      </div>

      <!-- Privacy Setting -->
      <div class="flex items-center justify-between mb-4 px-1">
        <div class="flex items-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            :class="{'text-indigo-600': isPublic, 'text-gray-500': !isPublic}" 
            width="20" 
            height="20" 
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
          <span class="ml-2 text-sm font-medium text-gray-700">
            {{ isPublic ? 'Public' : 'Private' }}
          </span>
        </div>
        
        <label class="relative inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            v-model="isPublic" 
            class="sr-only peer" 
          />
          <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
        </label>
      </div>

      <!-- Additional Options -->
      <div class="flex justify-between items-center mb-4">
        <div class="flex space-x-2">
          <!-- Camera/Media Upload Button -->
          <label 
            class="text-gray-600 hover:bg-gray-100 p-2 rounded-full cursor-pointer"
          >
            <input 
              type="file" 
              multiple 
              accept="image/*,video/*" 
              @change="handleFileSelect"
              class="hidden"
            />
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="9" cy="9" r="2.5"></circle>
              <path d="M21 15l-5-5L5 21"></path>
            </svg>
          </label>
          
          <!-- Hashtag Button -->
          <button 
            @click="addHashtag"
            class="text-gray-600 hover:bg-gray-100 p-2 rounded-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="4" y1="9" x2="20" y2="9"></line>
              <line x1="4" y1="15" x2="20" y2="15"></line>
              <line x1="10" y1="3" x2="8" y2="21"></line>
              <line x1="16" y1="3" x2="14" y2="21"></line>
            </svg>
          </button>
        </div>

        <button 
          @click="createPost"
          :disabled="isLoading || (!postContent.trim() && mediaFiles.length === 0)"
          :class="{
            'bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 transition-colors': true,
            'opacity-50 cursor-not-allowed': isLoading || (!postContent.trim() && mediaFiles.length === 0)
          }"
        >
          {{ isLoading ? 'Posting...' : 'Post' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'


// Stores
const postStore = usePostStore()
const hashtagStore = useHashtagStore()

// Props and emits
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'post-created'): void
}>()

// State
const postContent = ref('')
const mediaFiles = ref<File[]>([])
const isLoading = ref(false)
const errorMessage = ref('')
const hashtagSuggestions = ref<HashtagSuggestion[]>([])
const showHashtagSuggestions = ref(false)
const currentHashtag = ref('')
const isPublic = ref(true) // Default to public

// Watchers
watch(() => hashtagStore.suggestions, (newSuggestions) => {
  hashtagSuggestions.value = newSuggestions
})

// Methods
const handleContentInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  const text = target.value
  const lastWord = text.split(/\s/).pop() || ''

  if (lastWord.startsWith('#') && lastWord.length > 1) {
    currentHashtag.value = lastWord.substring(1)
    hashtagStore.fetchSuggestions(currentHashtag.value)
    showHashtagSuggestions.value = true
  } else {
    showHashtagSuggestions.value = false
  }
}

const selectHashtag = (suggestion: HashtagSuggestion) => {
  const contentWords = postContent.value.split(/\s/)
  contentWords.pop()
  contentWords.push(`#${suggestion.name} `)
  postContent.value = contentWords.join(' ')
  showHashtagSuggestions.value = false
}

const addHashtag = () => {
  postContent.value += ' #'
  // Focus on the textarea after adding # symbol
  setTimeout(() => {
    const textarea = document.querySelector('textarea')
    if (textarea) {
      textarea.focus()
      textarea.selectionStart = textarea.selectionEnd = textarea.value.length
    }
  }, 10)
}

// Handle media file selection
const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files) {
    const files = Array.from(input.files)
    // Limit to 4 media files
    mediaFiles.value = [...mediaFiles.value, ...files].slice(0, 4)
  }
}

// Remove a selected media file
const removeMedia = (index: number) => {
  mediaFiles.value.splice(index, 1)
}

// Create post with media upload
const createPost = async () => {
  if (!postContent.value.trim() && mediaFiles.value.length === 0) {
    errorMessage.value = 'Please add content or media to your post'
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    // Create FormData for the post
    const formData = new FormData()
    formData.append('caption', postContent.value)
    formData.append('privacy', isPublic.value ? 'public' : 'private')
    
    // Add media files to FormData
    mediaFiles.value.forEach(file => {
      formData.append('media', file)
    })

    // Create post with formData
    const response = await postStore.createPost(formData)
    
    // Reset form and emit success
    postContent.value = ''
    mediaFiles.value = []
    emit('post-created')
    emit('close')
  } catch (error) {
    console.error('Failed to create post:', error)
    errorMessage.value = error instanceof Error ? error.message : 'Failed to create post. Please try again.'
  } finally {
    isLoading.value = false
  }
}

// Preview selected media
const getMediaPreview = (file: File): string => {
  return URL.createObjectURL(file)
}

// Cleanup
onMounted(() => {
  // Clear previous suggestions
  hashtagStore.$reset()
})
</script>