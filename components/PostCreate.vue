<template>
  <div class="post-create p-4 bg-white rounded-lg shadow">
    <form @submit.prevent="handleSubmit">
      <!-- Error Alert -->
      <div v-if="error" class="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
        {{ error }}
      </div>

      <div class="hashtag-input-container">
        <textarea
          ref="captionTextarea"
          v-model="caption"
          @input="checkForHashtag"
          @keydown="handleKeydown"
          class="caption-textarea"
        ></textarea>

        <div v-if="showHashtagSuggestions && hashtagStore.suggestions.length > 0"
            :style="{position: 'absolute', top: cursorPosition.y + 'px', left: cursorPosition.x + 'px'}"
            class="hashtag-suggestions">
          <div v-for="(suggestion, index) in hashtagStore.suggestions"
              :key="suggestion.hashtag_id"
              :class="['suggestion-item', { 'active': index === activeIndex }]"
              @click="selectHashtag(suggestion)">
            #{{ suggestion.name }} ({{ suggestion.usage_count }})
          </div>
        </div>
      </div>
      <!-- Post Type Selection -->
      <div class="mb-4">
        <div class="flex space-x-4">
          <label class="inline-flex items-center">
            <input type="radio" v-model="postType" value="general" class="form-radio" :disabled="loading">
            <span class="ml-2">Postingan Umum</span>
          </label>
          <label class="inline-flex items-center">
            <input type="radio" v-model="postType" value="community" class="form-radio" :disabled="loading">
            <span class="ml-2">Postingan Komunitas</span>
          </label>
        </div>
      </div>

      <!-- Community Selection (if community post) -->
      <div v-if="postType === 'community'" class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">Pilih Komunitas</label>
        <select 
          v-model="selectedCommunity" 
          class="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
          :disabled="loading || (userCommunities && userCommunities.length === 0)">
          <option v-if="isFetchingCommunities" disabled :value="null">Memuat komunitas...</option>
          <option v-else-if="userCommunities && userCommunities.length === 0" disabled :value="null">Anda tidak tergabung dalam komunitas manapun</option>
          <option v-else disabled :value="null">Pilih komunitas</option>
          <option 
            v-for="community in userCommunities || []" 
            :key="community.community_id" 
            :value="community.community_id">
            {{ community.name }}
          </option>
        </select>
      </div>

      <!-- Privacy Selection -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">Pengaturan Privasi</label>
        <div class="flex space-x-4">
          <label class="inline-flex items-center">
            <input type="radio" v-model="privacy" value="private" class="form-radio" :disabled="loading">
            <span class="ml-2">Pribadi</span>
          </label>
          <label class="inline-flex items-center">
            <input type="radio" v-model="privacy" value="public" class="form-radio" :disabled="loading">
            <span class="ml-2">Publik</span>
          </label>
        </div>
      </div>

      <!-- File Input Section -->
      <div class="mb-4">
        <input ref="fileInput" type="file" multiple 
          accept="image/,video/,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,.txt" 
          class="hidden" @change="handleFileSelect"
          :disabled="loading" />

        <button type="button" @click="triggerFileInput" :disabled="loading"
          class="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50 hover:bg-blue-600 transition-colors">
          Tambah Media/Dokumen
        </button>

        <span v-if="fileValidationError" class="ml-2 text-red-500 text-sm">
          {{ fileValidationError }}
        </span>
      </div>

      <!-- Media and Document Previews -->
      <div v-if="previewUrls.length" class="grid grid-cols-2 gap-4 mb-4">
        <div v-for="(preview, index) in previewsWithType" :key="index" class="relative group">
          <!-- Image Preview -->
          <img v-if="preview.type.startsWith('image')" :src="preview.url" class="w-full h-48 object-cover rounded-lg"
            alt="Preview" />
          <!-- Video Preview -->
          <video v-else-if="preview.type.startsWith('video')" :src="preview.url"
            class="w-full h-48 object-cover rounded-lg" controls></video>
          <!-- Document Preview -->
          <div v-else class="bg-gray-100 p-4 rounded-lg flex items-center justify-between">
            <span class="truncate">{{ selectedFiles[index].name }}</span>
            <span class="text-sm text-gray-600">{{ formatFileSize(selectedFiles[index].size) }}</span>
          </div>
          <button type="button" @click="removeFile(index)"
            class="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            :disabled="loading">
            ×
          </button>
        </div>
      </div>

      <!-- Submit Button -->
      <button type="submit" :disabled="loading || isSubmitDisabled"
        class="w-full px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 hover:bg-blue-700 transition-colors">
        <span v-if="loading" class="flex items-center justify-center">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
            viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
            </path>
          </svg>
          Memposting...
        </span>
        <span v-else>Posting</span>
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { getCurrentUserId } from '~/stores/auth';
import { usePostStore } from '~/stores/posts'
import { useRuntimeConfig, useFetch } from '#imports'
import { useHashtagStore } from '~/stores/hastagStore'; 
import type { HashtagSuggestion } from '~/types/hastag'; 

// Types
interface Community {
  community_id: number;
  name: string;
}

interface PreviewWithType {
  url: string;
  type: string;
}

// Store
const postStore = usePostStore()
const hashtagStore = useHashtagStore()
const config = useRuntimeConfig()

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  modelValue: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:modelValue']);

// Refs
const fileInput = ref<HTMLInputElement | null>(null)
const selectedFiles = ref<File[]>([])
const previewUrls = ref<string[]>([])
const caption = ref(props.modelValue)
const loading = ref(false)
const error = ref('')
const fileValidationError = ref('')
const postType = ref<'general' | 'community'>('general')
const selectedCommunity = ref<number | null>(null)
const privacy = ref<'public' | 'private'>('public')
const userCommunities = ref<Community[]>([])
const isFetchingCommunities = ref(false)
const currentUserId = ref<string | null>(null)
const showHashtagSuggestions = ref(false)
const cursorPosition = ref({ x: 0, y: 0 })
const currentHashtagQuery = ref('')
const captionTextarea = ref<HTMLTextAreaElement | null>(null)
const activeIndex = ref(0) // Added for keyboard navigation
let hashtagTimer: ReturnType<typeof setTimeout> | null = null

// Constants
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const MAX_FILES = 4
const ALLOWED_TYPES = [
  // Images
  'image/jpeg', 'image/png', 'image/jpg', 'image/gif', 
  // Videos
  'video/mp4', 'video/quicktime', 'video/x-msvideo',
  // Documents
  'application/pdf', 
  'application/msword', 
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain'
]

// Computed properties
const isSubmitDisabled = computed(() => {
  const basicValidation = (!caption.value.trim() && selectedFiles.value.length === 0) || !!fileValidationError.value;
  const communityValidation = postType.value === 'community' && selectedCommunity.value === null;
  
  return basicValidation || communityValidation;
})

const previewsWithType = computed((): PreviewWithType[] => {
  return selectedFiles.value.map((file, index) => ({
    url: previewUrls.value[index],
    type: file.type
  }))
})

// Methods
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const fetchUserCommunities = async () => {
  isFetchingCommunities.value = true;
  const userId = getCurrentUserId();
  
  if (!userId) {
    console.error('ID pengguna tidak ditemukan');
    isFetchingCommunities.value = false;
    return;
  }
  
  currentUserId.value = userId;
  
  try {
    const { data } = await useFetch<any[]>(`${config.public.apiBase}/api/user-communities/${userId}/`);

    if (data.value && Array.isArray(data.value)) {
      // Map the API response to match our Community interface
      userCommunities.value = data.value.map(item => ({
        community_id: Number(item.id || item.community_id), // Handle both possible property names
        name: item.name
      }));
    } else {
      userCommunities.value = [];
    }

  } catch (e: any) {
    console.error('Gagal memuat komunitas:', e);
    error.value = 'Gagal memuat komunitas Anda';
  } finally {
    isFetchingCommunities.value = false;
  }
}

const checkForHashtag = (event: Event) => {
  const textarea = event.target as HTMLTextAreaElement;
  const text = textarea.value;
  const position = textarea.selectionStart;
  
  // Emit the updated value
  emit('update:modelValue', text);
  caption.value = text;
  
  // Find the word being typed
  let startPos = position;
  while (startPos > 0 && text[startPos - 1] !== ' ' && text[startPos - 1] !== '\n') {
    startPos--;
  }
  
  const currentWord = text.substring(startPos, position);
  
  // Check if the current word starts with #
  if (currentWord.startsWith('#') && currentWord.length > 1) {
    const query = currentWord.substring(1); // Remove the # character
    
    // Don't search again if query hasn't changed
    if (query === currentHashtagQuery.value) return;
    
    currentHashtagQuery.value = query;
    activeIndex.value = 0; // Reset active index when query changes
    
    // Get cursor position for suggestions box
    const rect = textarea.getBoundingClientRect();
    const lineHeight = parseInt(getComputedStyle(textarea).lineHeight);
    
    // Calculate position for suggestions dropdown
    const textBeforeCursor = text.substring(0, position);
    const lines = textBeforeCursor.split('\n').length;
    
    // Calculate cursor position based on line height
    const lineTop = rect.top + (lines - 1) * lineHeight;
    
    cursorPosition.value = {
      x: rect.left + 10,
      y: lineTop + lineHeight + window.scrollY
    };
    
    // Use debounce to avoid too many requests
    if (hashtagTimer) clearTimeout(hashtagTimer);
    hashtagTimer = setTimeout(() => {
      hashtagStore.fetchSuggestions(query);
    }, 300);
    
    showHashtagSuggestions.value = true;
  } else {
    showHashtagSuggestions.value = false;
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  // Only handle keys if suggestions are shown
  if (!showHashtagSuggestions.value || hashtagStore.suggestions.length === 0) return;
  
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault();
      activeIndex.value = (activeIndex.value + 1) % hashtagStore.suggestions.length;
      break;
    case 'ArrowUp':
      event.preventDefault();
      activeIndex.value = (activeIndex.value - 1 + hashtagStore.suggestions.length) % hashtagStore.suggestions.length;
      break;
    case 'Enter':
      event.preventDefault();
      if (hashtagStore.suggestions[activeIndex.value]) {
        selectHashtag(hashtagStore.suggestions[activeIndex.value]);
      }
      break;
    case 'Escape':
      event.preventDefault();
      showHashtagSuggestions.value = false;
      break;
    case 'Escape':
      event.preventDefault();
      showHashtagSuggestions.value = false;
      break;
  }
}

const selectHashtag = (suggestion: HashtagSuggestion) => {
  if (!captionTextarea.value) return;
  
  const text = caption.value;
  const position = captionTextarea.value.selectionStart;
  
  // Find the start of the current hashtag
  let startPos = position;
  while (startPos > 0 && text[startPos - 1] !== ' ' && text[startPos - 1] !== '\n' && text[startPos - 1] !== '#') {
    startPos--;
  }
  
  // If we found the # character, include it in the startPos
  if (startPos > 0 && text[startPos - 1] === '#') {
    startPos--;
  }
  
  // Replace the current hashtag with the selected one
  const newText = text.substring(0, startPos) + 
                 `#${suggestion.name} ` + 
                 text.substring(position);
  
  caption.value = newText;
  emit('update:modelValue', newText);
  
  // Close the suggestions dropdown
  showHashtagSuggestions.value = false;
  
  // Set cursor position after the inserted hashtag
  nextTick(() => {
    if (captionTextarea.value) {
      const newPosition = startPos + suggestion.name.length + 2; // +2 for # and space
      captionTextarea.value.selectionStart = newPosition;
      captionTextarea.value.selectionEnd = newPosition;
      captionTextarea.value.focus();
    }
  });
}

const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

const removeFile = (index: number) => {
  // Remove URL first to free memory
  URL.revokeObjectURL(previewUrls.value[index])
  
  // Remove file and preview
  selectedFiles.value.splice(index, 1)
  previewUrls.value.splice(index, 1)
  fileValidationError.value = ''
}

const validateFile = (file: File): boolean => {
  // Check file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    fileValidationError.value = 'Format file tidak didukung'
    return false
  }
  
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    fileValidationError.value = 'Ukuran file tidak boleh melebihi 10MB'
    return false
  }
  
  return true
}

const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files || input.files.length === 0) return
  
  // Check total files
  if (selectedFiles.value.length + input.files.length > MAX_FILES) {
    fileValidationError.value = `Maksimal ${MAX_FILES} file`
    return
  }
  
  // Process each selected file
  for (let i = 0; i < input.files.length; i++) {
    const file = input.files[i]
    
    if (!validateFile(file)) {
      return
    }
    
    // Add file
    selectedFiles.value.push(file)
    
    // Create preview
    if (file.type.startsWith('image/')) {
      previewUrls.value.push(URL.createObjectURL(file))
    } else if (file.type.startsWith('video/')) {
      previewUrls.value.push(URL.createObjectURL(file))
    } else {
      // For documents, just add a placeholder
      previewUrls.value.push('#')
    }
  }
  
  // Reset the input to allow selecting the same file again
  if (input) input.value = ''
}

const handleSubmit = async () => {
  if (isSubmitDisabled.value) return
  
  error.value = ''
  loading.value = true
  
  try {
    // Create form data
    const formData = new FormData()
    formData.append('caption', caption.value)
    formData.append('privacy', privacy.value)
    formData.append('post_type', postType.value)
    
    if (postType.value === 'community' && selectedCommunity.value) {
      formData.append('community_id', selectedCommunity.value.toString())
    }
    
    // Add files
    selectedFiles.value.forEach((file, index) => {
      formData.append(`file_${index}`, file)
    })
    
    // Submit
    await postStore.createPost(formData)
    
    // Clear form on success
    caption.value = ''
    selectedFiles.value = []
    previewUrls.value = []
    
    // Emit success event
    const emit = defineEmits(['update:modelValue', 'post-created']);
  } catch (e: any) {
    error.value = e.message || 'Gagal membuat postingan'
  } finally {
    loading.value = false
  }
}

// Clear hashtag suggestions when clicking elsewhere
const handleClickOutside = (event: MouseEvent) => {
  if (showHashtagSuggestions.value && captionTextarea.value && !captionTextarea.value.contains(event.target as Node)) {
    showHashtagSuggestions.value = false
  }
}

// Lifecycle hooks
onMounted(() => {
  fetchUserCommunities()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  // Clean up preview URLs
  previewUrls.value.forEach(url => {
    if (url !== '#') URL.revokeObjectURL(url)
  })
  
  // Remove event listener
  document.removeEventListener('click', handleClickOutside)
  
  // Clear any pending timeouts
  if (hashtagTimer) clearTimeout(hashtagTimer)
})

// Watch for modelValue changes from parent
watch(() => props.modelValue, (newValue) => {
  caption.value = newValue
})

// Watch for loading prop changes
watch(() => props.loading, (newValue) => {
  loading.value = newValue
})

// Watch for post type changes
watch(postType, (newValue) => {
  if (newValue === 'community' && !userCommunities.value.length) {
    fetchUserCommunities()
  }
})

// Export component properties
defineExpose({
  reset() {
    caption.value = ''
    selectedFiles.value = []
    previewUrls.value = []
    error.value = ''
    fileValidationError.value = ''
    postType.value = 'general'
    privacy.value = 'public'
    selectedCommunity.value = null
  }
})
</script>

<style scoped>
.hashtag-input-container {
  position: relative;
  margin-bottom: 1rem;
}

.caption-textarea {
  width: 100%;
  min-height: 100px;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  padding: 0.75rem;
  resize: vertical;
  outline: none;
  transition: border-color 0.2s;
}

.caption-textarea:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.hashtag-suggestions {
  position: absolute;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 50;
  max-height: 200px;
  overflow-y: auto;
  width: 250px;
}

.suggestion-item {
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.suggestion-item:hover, .suggestion-item.active {
  background-color: #f3f4f6;
}
</style>