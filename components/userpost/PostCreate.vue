<template>
  <div class="bg-white rounded-xl border border-gray-200 p-6 mb-6">
    <form @submit.prevent="handleSubmit">
      <div v-if="error" class="mb-4 p-4 bg-red-50 text-red-600 rounded-lg text-sm">
        {{ error }}
      </div>

      <div class="flex items-start space-x-4">
        <div class="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0"></div>
        <div class="flex-1">
          <textarea 
            v-model="caption" 
            placeholder="Share your thoughts..."
            class="w-full px-4 py-3 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            rows="3"
            :disabled="loading"
          />
        </div>
      </div>

      <!-- Media Preview Grid -->
      <div v-if="previewUrls.length" class="grid grid-cols-2 gap-3 mt-4">
        <div v-for="(preview, index) in previewsWithType" 
          :key="index" 
          class="relative group rounded-xl overflow-hidden">
          <img v-if="preview.type.startsWith('image')" 
            :src="preview.url" 
            class="w-full h-48 object-cover" 
            alt="Preview" />
          <video v-else-if="preview.type.startsWith('video')" 
            :src="preview.url"
            class="w-full h-48 object-cover" 
            controls></video>
          <button type="button" 
            @click="removeFile(index)"
            class="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            :disabled="loading">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>

      <div class="flex items-center justify-between mt-4 pt-4 border-t">
        <div class="flex space-x-2">
          <input ref="fileInput" type="file" multiple accept="image/*,video/*" 
            class="hidden" @change="handleFileSelect" :disabled="loading" />
          <button type="button" 
            @click="triggerFileInput" 
            :disabled="loading"
            class="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
            <i class="fas fa-image text-lg"></i>
          </button>
          <button type="button" 
            @click="triggerFileInput" 
            :disabled="loading"
            class="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
            <i class="fas fa-video text-lg"></i>
          </button>
        </div>
        <button type="submit" 
          :disabled="loading || isSubmitDisabled"
          class="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
          <span v-if="loading" class="flex items-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
              viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
              </path>
            </svg>
            Posting...
          </span>
          <span v-else>Post</span>
        </button>
      </div>
    </form>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
import { usePostStore } from '~/stores/posts'

const postStore = usePostStore()

// Refs
const fileInput = ref<HTMLInputElement | null>(null)
const selectedFiles = ref<File[]>([])
const previewUrls = ref<string[]>([])
const caption = ref('')
const loading = ref(false)
const error = ref('')
const fileValidationError = ref('')

// Constants
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const MAX_FILES = 4
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'video/mp4']

// Computed
const isSubmitDisabled = computed(() => {
  return (!caption.value.trim() && selectedFiles.value.length === 0) || !!fileValidationError.value
})
const previewsWithType = computed(() => {
  return selectedFiles.value.map((file, index) => ({
    url: previewUrls.value[index],
    type: file.type
  }))
})
// Methods
const validateFiles = (files: File[]): boolean => {
  fileValidationError.value = ''

  if (files.length > MAX_FILES) {
    fileValidationError.value = `Maximum ${MAX_FILES} files allowed`
    return false
  }

  for (const file of files) {
    if (!ALLOWED_TYPES.includes(file.type)) {
      fileValidationError.value = 'Invalid file type. Only images and MP4 videos are allowed'
      return false
    }

    if (file.size > MAX_FILE_SIZE) {
      fileValidationError.value = 'Files must be less than 5MB'
      return false
    }
  }

  return true
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files) {
    const newFiles = Array.from(input.files)

    if (validateFiles(newFiles)) {
      // Clear previous files and previews
      previewUrls.value.forEach(url => URL.revokeObjectURL(url))
      selectedFiles.value = newFiles
      previewUrls.value = newFiles.map(file => URL.createObjectURL(file))
    }

    // Reset input to allow selecting the same file again
    input.value = ''
  }
}

const removeFile = (index: number) => {
  URL.revokeObjectURL(previewUrls.value[index])
  selectedFiles.value = selectedFiles.value.filter((_, i) => i !== index)
  previewUrls.value = previewUrls.value.filter((_, i) => i !== index)
  fileValidationError.value = ''
}

const handleSubmit = async () => {
  if (isSubmitDisabled.value) return

  error.value = ''
  loading.value = true

  try {
    const formData = new FormData()
    formData.append('caption', caption.value.trim())

    selectedFiles.value.forEach((file: File) => {
      formData.append('media', file)
    })

    await postStore.createPost(formData)

    // Reset form
    caption.value = ''
    previewUrls.value.forEach(url => URL.revokeObjectURL(url))
    selectedFiles.value = []
    previewUrls.value = []

  } catch (e: any) {
    error.value = e.message || 'Failed to create post. Please try again.'
  } finally {
    loading.value = false
  }
}

// Cleanup
onUnmounted(() => {
  previewUrls.value.forEach(url => URL.revokeObjectURL(url))
})
</script>